import { logWrite, AUTH_HEADERS, type AuthCredentials } from '@geins/core';

export interface AuthUserToken {
  maxAge: number;
  token: string;
  refreshToken: string;
}
export interface AuthSignature {
  identity: string;
  signature: string;
  timestamp: string;
}

export class AuthServiceClient {
  private authEndpoint: string;
  private signEndpoint: string;
  private token: string = '';
  private refreshToken: string = '';
  private maxAge: number = 0;

  constructor(authEndpoint: string, signEndpoint: string) {
    if (!authEndpoint || !signEndpoint) {
      throw new Error('Both authEndpoint and signEndpoint are required');
    }
    this.authEndpoint = authEndpoint;
    this.signEndpoint = signEndpoint;
  }

  private async digest(password: string): Promise<string> {
    const salt =
      'Dd1dfLonNy6Am2fXQl2AcoI+IbhLhXvaibnDNn8uEa6vbJ05eyJajSuGFm9uQSmD';
    const buffer = await crypto.subtle.digest(
      'SHA-384',
      new TextEncoder().encode(password + salt),
    );
    return this.arrayBufferToBase64(buffer);
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const byteArray = new Uint8Array(buffer);
    const binaryString = byteArray.reduce(
      (acc, byte) => acc + String.fromCharCode(byte),
      '',
    );
    return btoa(binaryString);
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
        password: await this.digest(password),
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
        password: await this.digest(currentPassword),
        newPassword: await this.digest(newPassword),
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
}
