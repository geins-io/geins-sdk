import {
  logWrite,
  AUTH_HEADERS,
  type AuthCredentials,
  type AuthUserToken,
  type AuthSignature,
} from '@geins/core';
import { digest } from './authHelpers';

export class AuthServiceClient {
  private authEndpoint: string;
  private signEndpoint: string;

  constructor(authEndpoint: string, signEndpoint: string) {
    if (!authEndpoint || !signEndpoint) {
      throw new Error('Both authEndpoint and signEndpoint are required');
    }
    this.authEndpoint = authEndpoint;
    this.signEndpoint = signEndpoint;
  }

  private getAuthEndpointUrl(endpoint: string): string {
    return `${this.authEndpoint}/${endpoint}`;
  }

  private getSignEndpointUrl(signature: string): string {
    return `${this.signEndpoint}${encodeURIComponent(signature)}`;
  }

  private extractRefreshTokenFromResponse(response: Response): string {
    const refreshTokenHeader = response.headers.get(AUTH_HEADERS.REFRESH_TOKEN);
    if (!refreshTokenHeader) {
      throw new Error('Error');
    }
    return refreshTokenHeader;
  }

  private async requestAuthChallenge(username: string): Promise<string> {
    const url = this.getAuthEndpointUrl('login');
    const options: RequestInit = {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    };
    const response = await fetch(url, options);
    const text = await response.text();
    const retval = JSON.parse(text);
    if (!retval?.sign) {
      throw new Error('Failed to fetch sign');
    }
    return retval.sign;
  }

  private async verifyAuthChallenge(signatureToken: string): Promise<AuthSignature> {
    const url = this.getSignEndpointUrl(signatureToken);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to verify challenge');
    }
    const text = await response.text();
    if (!text) {
      throw new Error('Failed to verify challenge: Empty response');
    }
    return JSON.parse(text);
  }

  private async fetchUserToken(
    username: string,
    password: string,
    rememberUser: boolean,
  ): Promise<AuthUserToken> {
    const url = this.getAuthEndpointUrl('login');

    const challangeToken = await this.requestAuthChallenge(username);
    const authenticationSignature = await this.verifyAuthChallenge(challangeToken);
    const requestBody: Record<string, any> = {
      username,
      signature: authenticationSignature,
      password: await digest(password),
      ...(rememberUser ? {} : { sessionLifetime: 30 }),
    };

    const requestOptions: RequestInit = {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`Failed to fetch user token: ${response.statusText}`);
    }

    const refreshToken = this.extractRefreshTokenFromResponse(response);

    const userToken = await response.text();
    if (!userToken) {
      throw new Error('Failed to fetch user token: Empty response');
    }

    const retval = JSON.parse(userToken);
    return {
      maxAge: retval.maxAge,
      token: retval.token,
      refreshToken,
    };
  }

  private async fetchRefreshToken(refreshToken: string): Promise<AuthUserToken> {
    const url = this.getAuthEndpointUrl('login');
    const requestOptions: RequestInit = {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        [`${AUTH_HEADERS.REFRESH_TOKEN}`]: refreshToken,
      },
    };
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`Failed to renew refresh token: ${response.statusText}`);
    }

    const newRefreshToken = this.extractRefreshTokenFromResponse(response);

    const userToken = await response.text();
    if (!userToken) {
      throw new Error('Failed to fetch user token: Empty response');
    }

    const retval = JSON.parse(userToken);
    return {
      maxAge: retval.maxAge,
      token: retval.token,
      refreshToken: newRefreshToken,
    };
  }

  private async performChangePassword(
    username: string,
    currentPassword: string,
    newPassword: string,
    refreshToken: string,
  ): Promise<AuthUserToken> {
    const url = this.getAuthEndpointUrl('password');

    const challangeToken = await this.requestAuthChallenge(username);
    const authenticationSignature = await this.verifyAuthChallenge(challangeToken);

    const requestBody: Record<string, any> = {
      username,
      signature: authenticationSignature,
      password: await digest(currentPassword),
      newPassword: await digest(newPassword),
    };

    const requestOptions: RequestInit = {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        [`${AUTH_HEADERS.REFRESH_TOKEN}`]: refreshToken,
      },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`Failed to change password: ${response.statusText}`);
    }

    refreshToken = this.extractRefreshTokenFromResponse(response);

    const userToken = await response.text();
    if (!userToken) {
      throw new Error('Failed to change password: Empty response');
    }

    const retval = JSON.parse(userToken);
    return {
      maxAge: retval.maxAge,
      token: retval.token,
      refreshToken,
    };
  }

  private async performUserRegister(username: string, password: string): Promise<AuthUserToken> {
    const url = this.getAuthEndpointUrl('register');

    const challangeToken = await this.requestAuthChallenge(username);
    const authenticationSignature = await this.verifyAuthChallenge(challangeToken);

    const requestBody: Record<string, any> = {
      username,
      signature: authenticationSignature,
      password: await digest(password),
    };

    const requestOptions: RequestInit = {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`Failed to register user: ${response.statusText}`);
    }

    const refreshToken = this.extractRefreshTokenFromResponse(response);

    const userToken = await response.text();
    if (!userToken) {
      throw new Error('Failed to register user: Empty response');
    }

    const retval = JSON.parse(userToken);
    return {
      maxAge: retval.maxAge,
      token: retval.token,
      refreshToken,
    };
  }

  public async register(username: string, password: string): Promise<AuthUserToken> {
    return this.performUserRegister(username, password);
  }

  public async login(username: string, password: string, rememberUser?: boolean): Promise<AuthUserToken> {
    return this.fetchUserToken(username, password, rememberUser!);
  }

  public async renewRefreshtoken(refreshToken: string): Promise<AuthUserToken> {
    return this.fetchRefreshToken(refreshToken);
  }

  public async changePassword(credentials: AuthCredentials, refreshToken: string): Promise<AuthUserToken> {
    if (!credentials.newPassword) {
      throw new Error('New password is required');
    }
    return this.performChangePassword(
      credentials.username,
      credentials.password,
      credentials.newPassword,
      refreshToken,
    );
  }

  public async logout(refreshToken: string): Promise<boolean> {
    // Implementation if needed, currently just returning true
    return true;
  }
}
