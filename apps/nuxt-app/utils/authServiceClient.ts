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

    const fetchOptions: RequestInit = {
      method: requiresSign ? 'POST' : 'GET',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(this.refreshToken
          ? { Cookie: `refresh=${this.refreshToken}` }
          : {}),
      },
      body: requiresSign ? JSON.stringify(authRequestBody) : undefined,
    };

    /*   if (this.refreshToken) {
      fetchOptions?.headers?['Cookie'] = `refresh=${this.refreshToken}`;
    } */

    let data = await this.fetchData(url, fetchOptions);
    if (data?.sign) {
      authRequestBody = await this.addCredentialsToRequest(
        authRequestBody,
        data.sign,
        credentials!,
        action,
      );

      fetchOptions.body = JSON.stringify(authRequestBody);
      data = await this.fetchData(url, fetchOptions);
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
    action: string,
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
      //add server side cookie to fetch
      //options.headers['Cookie'] = this.cookie;

      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data from endpoint: ${response.status} ${response.statusText}`,
        );
      }

      const setCookie = response.headers.get('set-cookie');
      let refreshToken = null;
      if (setCookie) {
        const cookies = setCookie.split(';');
        for (const cookie of cookies) {
          if (cookie.trim().startsWith('refresh=')) {
            refreshToken = cookie.split('=')[1];
            break;
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
