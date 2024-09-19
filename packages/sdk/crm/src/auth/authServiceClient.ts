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

  private async requestAuthChallenge(username: string): Promise<string> {
    try {
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
      if (!retval.sign) {
        throw new Error('Failed to fetch sign');
      }
      return retval.sign;
    } catch (error) {
      throw new Error('Failed to request challenge');
    }
  }

  private async verifyAuthChallenge(
    signatureToken: string,
  ): Promise<AuthSignature> {
    const url = this.getSignEndpointUrl(signatureToken);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error();
      }
      const text = await response.text();
      if (!text) {
        throw new Error();
      }
      return JSON.parse(text);
    } catch (error) {
      throw new Error('Failed to verify challenge');
    }
  }

  private async fetchUserToken(
    username: string,
    password: string,
    rememberUser: boolean,
  ): Promise<AuthUserToken> {
    try {
      const url = this.getAuthEndpointUrl('login');

      // Step 1: Request a challenge token for the given username (initiates the authentication process)
      const challangeToken = await this.requestAuthChallenge(username);

      // Step 2: Verify the challenge token and retrieve the authentication signature
      const authenticationSignature =
        await this.verifyAuthChallenge(challangeToken);

      const requestBody: Record<string, any> = {
        username,
        signature: authenticationSignature,
        password: await digest(password),
        ...(!rememberUser ? { sessionLifetime: 30 } : {}),
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
        throw new Error('Failed to renew refresh token');
      }

      const refreshTokenHeader = response.headers.get(
        AUTH_HEADERS.REFRESH_TOKEN,
      );

      if (!refreshTokenHeader) {
        throw new Error('Failed to fetch refresh token');
      }

      const userToken = await response.text();
      if (!userToken) {
        throw new Error('Failed to fetch user token');
      }

      const retval = JSON.parse(userToken);
      return {
        maxAge: retval.maxAge,
        token: retval.token,
        refreshToken: refreshTokenHeader,
      };
    } catch (error) {
      throw new Error('Failed authentication');
    }
  }

  private async fetchRefreshToken(
    currentRefreshtoken: string,
  ): Promise<AuthUserToken> {
    const url = this.getAuthEndpointUrl('login');
    const requestOptions: RequestInit = {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        [`${AUTH_HEADERS.REFRESH_TOKEN}`]: currentRefreshtoken,
      },
    };
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error('Failed to renew refresh token');
    }

    const refreshTokenHeader = response.headers.get(AUTH_HEADERS.REFRESH_TOKEN);

    if (!refreshTokenHeader) {
      throw new Error('Failed to fetch refresh token');
    }

    const userToken = await response.text();
    if (!userToken) {
      throw new Error('Failed to fetch user token');
    }

    const retval = JSON.parse(userToken);
    return {
      maxAge: retval.maxAge,
      token: retval.token,
      refreshToken: refreshTokenHeader,
    };
  }

  private async performChangePassword(
    username: string,
    currentPassword: string,
    newPassword: string,
    currentRefreshtoken: string,
  ): Promise<any> {
    try {
      const url = this.getAuthEndpointUrl('password');

      // Step 1: Request a challenge token for the given username (initiates the authentication process)
      const challangeToken = await this.requestAuthChallenge(username);

      // Step 2: Verify the challenge token and retrieve the authentication signature
      const authenticationSignature =
        await this.verifyAuthChallenge(challangeToken);

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
          [`${AUTH_HEADERS.REFRESH_TOKEN}`]: currentRefreshtoken,
        },
        body: JSON.stringify(requestBody),
      };

      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error('Failed to change password');
      }

      const refreshTokenHeader = response.headers.get(
        AUTH_HEADERS.REFRESH_TOKEN,
      );

      if (!refreshTokenHeader) {
        throw new Error('Failed to change password');
      }

      const userToken = await response.text();
      if (!userToken) {
        throw new Error('Failed to change password');
      }

      const retval = JSON.parse(userToken);
      return {
        maxAge: retval.maxAge,
        token: retval.token,
        refreshToken: refreshTokenHeader,
      };
    } catch (error) {
      throw new Error('Failed to change password');
    }
  }

  public async login(
    username: string,
    password: string,
    rememberUser?: boolean,
  ): Promise<AuthUserToken> {
    try {
      return this.fetchUserToken(username, password, rememberUser!);
    } catch (error) {
      throw new Error('Failed to login');
    }
  }

  public async renewRefreshtoken(currentRefreshtoken: string): Promise<any> {
    try {
      return await this.fetchRefreshToken(currentRefreshtoken);
    } catch (error) {
      throw new Error('Failed to renew refresh token');
    }
  }

  public async changePassword(
    credentials: AuthCredentials,
    currentRefreshtoken: string,
  ): Promise<AuthUserToken> {
    try {
      if (!credentials.newPassword) {
        throw new Error('New password is required');
      }
      //return this.fetchUserToken(username, password, rememberUser!);
      return this.performChangePassword(
        credentials.username,
        credentials.password,
        credentials.newPassword,
        currentRefreshtoken,
      );
    } catch (error) {
      throw new Error('Failed to change password');
    }
  }

  //obsolete
  public async logout(currentRefreshtoken: string): Promise<boolean> {
    return true;
  }
}
