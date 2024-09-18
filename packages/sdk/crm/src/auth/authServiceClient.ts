import { logWrite, AUTH_HEADERS } from '@geins/core';
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

  public async connect(
    action: string,
    credentials?: {
      username: string;
      password: string;
      newPassword?: string;
      rememberUser?: boolean;
    },
  ): Promise<{ token: string; maxAge: number; refreshToken: string }> {
    this.resetTokenData(); // Always clear tokens before any action

    switch (action) {
      case 'login':
        return await this.handleLogin(credentials!);
      case 'register':
        return await this.handleRegister(credentials!);
      case 'logout':
        return await this.handleLogout();
      case 'password':
        return await this.handlePasswordChange(credentials!);
      case 'refresh':
        return await this.handleTokenRefresh();
      default:
        throw new Error(`Unsupported action: ${action}`);
    }
  }

  private async handleLogin(credentials: {
    username: string;
    password: string;
    rememberUser?: boolean;
  }): Promise<{ token: string; maxAge: number; refreshToken: string }> {
    const authRequestBody = await this.prepareAuthRequest(credentials, 'login');
    return await this.fetchAndProcessToken(authRequestBody, 'login');
  }

  private async handleRegister(credentials: {
    username: string;
    password: string;
  }): Promise<{ token: string; maxAge: number; refreshToken: string }> {
    const authRequestBody = await this.prepareAuthRequest(
      credentials,
      'register',
    );
    return await this.fetchAndProcessToken(authRequestBody, 'register');
  }

  private async handleLogout(): Promise<{
    token: string;
    maxAge: number;
    refreshToken: string;
  }> {
    const authRequestBody = {};
    return await this.fetchAndProcessToken(authRequestBody, 'logout');
  }

  private async handlePasswordChange(credentials: {
    username: string;
    password: string;
    newPassword: string;
  }): Promise<{ token: string; maxAge: number; refreshToken: string }> {
    const authRequestBody = await this.addCredentialsToRequest(
      await this.prepareAuthRequest(credentials, 'password'),
      credentials.username, // Assume the sign is part of the username or add appropriate logic
      credentials,
      'password',
    );
    return await this.fetchAndProcessToken(authRequestBody, 'password');
  }

  private async handleTokenRefresh(): Promise<{
    token: string;
    maxAge: number;
    refreshToken: string;
  }> {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }
    const authRequestBody = { refreshToken: this.refreshToken };
    return await this.fetchAndProcessToken(authRequestBody, 'refresh');
  }

  private async fetchAndProcessToken(
    authRequestBody: Record<string, any>,
    action: string,
  ): Promise<{ token: string; maxAge: number; refreshToken: string }> {
    const url = `${this.authEndpoint}/${action}`;
    const fetchOptions: RequestInit = {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        ...(this.refreshToken
          ? { [`${AUTH_HEADERS.REFRESH_TOKEN}`]: this.refreshToken }
          : {}),
      },
      body: JSON.stringify(authRequestBody),
    };

    const data = await this.fetchData(url, fetchOptions);
    if (data?.token) {
      this.setTokenData(data); // Optionally update internal state
      return {
        token: data.token,
        maxAge: data.maxAge,
        refreshToken: this.refreshToken,
      };
    }

    throw new Error('Failed to retrieve token');
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
    return authRequestBody;
  }

  private async fetchSignAccount(sign: string): Promise<string> {
    const url = `${this.signEndpoint}${encodeURIComponent(sign)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch sign account');
    }
    return await response.json();
  }

  private async fetchData(url: string, options: RequestInit): Promise<any> {
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
        return retval;
      } catch (jsonError) {
        throw new Error('Invalid JSON response');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      return null;
    }
  }

  private resetTokenData(): void {
    this.token = '';
    this.maxAge = 0;
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
}
