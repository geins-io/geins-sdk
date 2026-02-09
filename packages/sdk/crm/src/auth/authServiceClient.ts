import { AUTH_HEADERS, AuthError, GeinsError, GeinsErrorCode, type AuthCredentials, type AuthSignature, type AuthUserToken } from '@geins/core';
import { digest } from './authHelpers';

/**
 * Low-level HTTP client for the Geins auth API.
 * Handles the challenge–response authentication flow: request challenge → verify
 * signature → submit credentials with signed payload.
 */
export class AuthServiceClient {
  private static readonly FETCH_TIMEOUT_MS = 10_000;
  private authEndpoint: string;
  private signEndpoint: string;

  constructor(authEndpoint: string, signEndpoint: string) {
    if (!authEndpoint || !signEndpoint) {
      throw new GeinsError('Both authEndpoint and signEndpoint are required', GeinsErrorCode.INVALID_ARGUMENT);
    }
    this.authEndpoint = authEndpoint;
    this.signEndpoint = signEndpoint;
  }

  destroy(): void {}

  private getAuthEndpointUrl(endpoint: string): string {
    return `${this.authEndpoint}/${endpoint}`;
  }

  private getSignEndpointUrl(signature: string): string {
    return `${this.signEndpoint}${encodeURIComponent(signature)}`;
  }

  private extractRefreshTokenFromResponse(response: Response): string {
    const refreshTokenHeader = response.headers.get(AUTH_HEADERS.REFRESH_TOKEN);
    if (!refreshTokenHeader) {
      throw new AuthError('Challenge request failed');
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
      signal: AbortSignal.timeout(AuthServiceClient.FETCH_TIMEOUT_MS),
    };
    const response = await fetch(url, options);
    const text = await response.text();
    if (!text) {
      throw new AuthError('Failed to request challenge: Empty response');
    }

    const retval = JSON.parse(text);
    if (!retval?.sign) {
      throw new AuthError('Failed to fetch sign', GeinsErrorCode.AUTH_FAILED);
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
      signal: AbortSignal.timeout(AuthServiceClient.FETCH_TIMEOUT_MS),
    });
    if (!response.ok) {
      throw new AuthError('Failed to verify challenge');
    }
    const text = await response.text();
    if (!text) {
      throw new AuthError('Failed to verify challenge: Empty response');
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
      signal: AbortSignal.timeout(AuthServiceClient.FETCH_TIMEOUT_MS),
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new AuthError(`Failed to fetch user token: ${response.statusText}`);
    }

    const refreshToken = this.extractRefreshTokenFromResponse(response);

    const userToken = await response.text();
    if (!userToken) {
      throw new AuthError('Failed to fetch user token: Empty response');
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
      signal: AbortSignal.timeout(AuthServiceClient.FETCH_TIMEOUT_MS),
    };
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new AuthError(`Failed to renew refresh token: ${response.statusText}`);
    }

    const newRefreshToken = this.extractRefreshTokenFromResponse(response);

    const userToken = await response.text();
    if (!userToken) {
      throw new AuthError('Failed to fetch user token: Empty response');
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
      signal: AbortSignal.timeout(AuthServiceClient.FETCH_TIMEOUT_MS),
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new AuthError(`Failed to change password: ${response.statusText}`);
    }

    refreshToken = this.extractRefreshTokenFromResponse(response);

    const userToken = await response.text();
    if (!userToken) {
      throw new AuthError('Failed to change password: Empty response');
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
      signal: AbortSignal.timeout(AuthServiceClient.FETCH_TIMEOUT_MS),
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new AuthError(`Failed to register user: ${response.statusText}`);
    }

    const refreshToken = this.extractRefreshTokenFromResponse(response);

    const userToken = await response.text();
    if (!userToken) {
      throw new AuthError('Failed to register user: Empty response');
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
      throw new GeinsError('New password is required', GeinsErrorCode.INVALID_ARGUMENT);
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
