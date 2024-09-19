import { logWrite, AUTH_HEADERS, type AuthCredentials } from '@geins/core';
import { log } from 'console';

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

  // obsolete
  private async performLogout(currentRefreshtoken: string): Promise<any> {
    const url = this.getAuthEndpointUrl('logout');
    const requestOptions: RequestInit = {
      method: 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        [`${AUTH_HEADERS.REFRESH_TOKEN}`]: currentRefreshtoken,
      },
    };
    await fetch(url, requestOptions);
    return true;
  }

  /************* helpers **************** */

  /************* ACTIONS **************** */
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
  // obsolete
  public async logout(currentRefreshtoken: string): Promise<boolean> {
    try {
      const result = await this.performLogout(currentRefreshtoken);
      return result.ok || false;
    } catch (error) {
      throw new Error('Failed to logout');
    }
    return true;
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

  /************* ACTIONS **************** */

  /******UTIL */

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

  /**********UYOIL */

  /*


----------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------

*/

  /// OLD ///
  public async connect(
    credentials?: {
      username: string;
      password: string;
      newPassword?: string;
      rememberUser?: boolean;
    },
    action: string = 'login',
  ): Promise<void> {
    this.resetTokenData();
    const url = `${this.authEndpoint}/${action}`;
    const requiresSign = Boolean(credentials);

    let authRequestBody: Record<string, any> = {};

    if (requiresSign) {
      authRequestBody = await this.prepareAuthRequest(credentials!, action);
    }
    logWrite('url', url);
    logWrite('credentials', credentials);
    logWrite('requiresSign', requiresSign);
    logWrite('authRequestBody', authRequestBody);

    const fetchOptions: RequestInit = {
      method: requiresSign ? 'POST' : 'GET',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        ...(this.refreshToken
          ? { [`${AUTH_HEADERS.REFRESH_TOKEN}`]: this.refreshToken }
          : {}),
      },

      body: requiresSign ? JSON.stringify(authRequestBody) : undefined,
    };
    logWrite('fetchOptions', fetchOptions);

    let data = await this.fetchData(url, fetchOptions);

    logWrite('data 1.', data);

    if (data?.sign) {
      authRequestBody = await this.addCredentialsToRequest(
        authRequestBody,
        data.sign,
        credentials!,
        action,
      );
      logWrite('authRequestBody 1.', authRequestBody);

      fetchOptions.body = JSON.stringify(authRequestBody);

      logWrite('fetchOptions 1.', fetchOptions);

      data = await this.fetchData(url, fetchOptions);

      logWrite('data 2.', data);
    }

    if (data?.token) {
      this.setTokenData(data);
    }
  }

  private async prepareAuthRequest(
    credentials: {
      username: string;
      password: string;
      newPassword?: string;
      rememberUser?: boolean;
    },
    action?: string,
  ): Promise<Record<string, any>> {
    const authRequestBody: Record<string, any> = {
      username: credentials.username,
    };
    return authRequestBody;
  }

  private async addCredentialsToRequest(
    authRequestBody: Record<string, any>,
    sign: string,
    credentials: {
      username: string;
      password: string;
      newPassword?: string;
      rememberUser?: boolean;
    },
    action: string,
  ): Promise<Record<string, any>> {
    authRequestBody.signature = await this.fetchSignAccount(sign);
    authRequestBody.password = await this.digest(credentials.password);
    if (action === 'password') {
      authRequestBody.newPassword = await this.digest(credentials.newPassword!);
    }

    if (!credentials.rememberUser) {
      authRequestBody.sessionLifetime = 30;
    }
    logWrite('authRequestBody', authRequestBody);
    return authRequestBody;
  }

  private async fetchSignature(username: string): Promise<any> {
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
  }

  private async fetchData(url: string, options: RequestInit): Promise<any> {
    logWrite('url', url);
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data from endpoint: ${response.status} ${response.statusText}`,
        );
      }

      let refreshToken = null;
      const refreshTokenHeader = response.headers.get(
        AUTH_HEADERS.REFRESH_TOKEN,
      );
      logWrite('refreshTokenHeader', refreshTokenHeader);

      if (refreshTokenHeader) {
        refreshToken = refreshTokenHeader;
      }

      if (!refreshToken) {
        const setCookie = response.headers.get('set-cookie');
        if (setCookie) {
          const cookies = setCookie.split(';');
          for (const cookie of cookies) {
            if (cookie.trim().startsWith('refresh=')) {
              refreshToken = cookie.split('=')[1];
              break;
            }
          }
        }
      }

      if (refreshToken) {
        this.refreshToken = refreshToken;
      }

      const text = await response.text();
      if (!text) {
        return null;
      }

      try {
        const retval = JSON.parse(text);
        logWrite('retval', retval);
        return retval;
      } catch (jsonError) {
        throw new Error('Invalid JSON response');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  private async fetchSignAccount(signatureToken: string): Promise<string> {
    const url = this.getSignEndpointUrl(signatureToken);
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch signed account');
    }
    return await response.json();
  }

  private resetTokenData(): void {
    this.token = '';
    this.maxAge = 0;
  }

  public get authorized(): boolean {
    return !!this.token;
  }

  public get claims(): Record<string, any> | null {
    if (!this.token) {
      return null;
    }
    try {
      const base64Url = this.token.split('.')[1];
      if (!base64Url) {
        throw new Error('Invalid token format: missing payload');
      }
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedString = atob(base64);
      return JSON.parse(decodedString);
    } catch (error) {
      console.error('Failed to decode token claims:', error);
      return null;
    }
  }

  public get serializedClaims(): string {
    const claims = this.claims;
    if (!claims) return '';
    return Object.entries(claims)
      .map(([key, value]) =>
        Array.isArray(value)
          ? value.map((v) => `${key}=${v}`).join(';')
          : `${key}=${value}`,
      )
      .join(';');
  }

  public get(endpoint: string): Promise<any> {
    return this.sendRequest('GET', endpoint);
  }

  private async sendRequest(method: string, endpoint: string): Promise<any> {
    try {
      const response = await fetch(endpoint, { method, cache: 'no-cache' });
      return await response.json();
    } catch (err) {
      console.error('Error in sendRequest:', err);
      return null;
    }
  }

  public getMaxAge(): number {
    return this.maxAge;
  }

  public getToken(): string {
    return this.token;
  }

  public getRefreshToken(): string {
    return this.refreshToken;
  }

  private setTokenData(data: { token: string; maxAge: number }): void {
    this.token = data.token;
    this.maxAge = data.maxAge;
  }

  public setRefreshToken(token: string): void {
    this.refreshToken = token;
  }
}
