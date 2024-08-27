// THE CLIENT WITH ALL LOGIC FOR AUTHENTICATION

export default class AuthClient {
  private authEndpoint: string;
  private signAccount: (sign: string) => Promise<string>;
  private token: string = '';
  private maxAge: number = 0;

  constructor(
    signEndpoint: (sign: string) => Promise<string>,
    authEndpoint: string,
  ) {
    if (!signEndpoint || !authEndpoint) {
      throw new Error('An endpoint that can verify identities is required');
    }
    this.authEndpoint = authEndpoint;
    this.signAccount = signEndpoint;
  }

  getMaxAge(): number {
    return this.maxAge;
  }

  getToken(): string {
    return this.token;
  }

  setTokenData(data: { token: string; maxAge: number }): void {
    this.token = data.token;
    this.maxAge = data.maxAge;
  }

  async connect(
    credentials?: {
      username: string;
      password: string;
      newPassword?: string;
      rememberUser?: boolean;
    },
    action: string = 'login',
  ): Promise<void> {
    this.setTokenData({ token: '', maxAge: 0 });
    const url = `${this.authEndpoint}${action}`;
    const getSign = !!credentials;
    const auth: Record<string, any> = { username: credentials?.username };
    const fetchOptions: RequestInit = {
      method: getSign ? 'POST' : 'GET',
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (getSign) {
      fetchOptions.body = JSON.stringify(auth);
    }

    const addCredentials = async (sign: string) => {
      auth.signature = JSON.parse(await this.signAccount(sign));
      auth.password = await this.digest(credentials!.password);
      if (action === 'password') {
        auth.newPassword = await this.digest(credentials!.newPassword!);
      }
      if (!credentials!.rememberUser) {
        auth.sessionLifetime = 30;
      }
      fetchOptions.body = JSON.stringify(auth);
    };

    let data = await fetch(url, fetchOptions)
      .then((response) => response.json())
      .catch(() => {});

    if (data?.sign) {
      await addCredentials(data.sign);
      data = await fetch(url, fetchOptions)
        .then((response) => response.json())
        .then((data) => {
          if (data?.token) {
            this.setTokenData(data);
          }
        })
        .catch(() => {});
    } else if (data?.token) {
      this.setTokenData(data);
    }
  }

  async digest(password: string): Promise<string> {
    const salt =
      'Dd1dfLonNy6Am2fXQl2AcoI+IbhLhXvaibnDNn8uEa6vbJ05eyJajSuGFm9uQSmD';
    const buffer = await crypto.subtle.digest(
      'SHA-384',
      new TextEncoder().encode(password + salt),
    );
    const byteArray = new Uint8Array(buffer);

    // Convert bytes to string
    let binaryString = '';
    byteArray.forEach((byte) => {
      binaryString += String.fromCharCode(byte);
    });

    // Encode to base64
    return btoa(binaryString);
  }

  get authorized(): boolean {
    return !!this.token;
  }

  get claims(): Record<string, any> | null {
    try {
      // Ensure that the token is correctly formatted
      let base64Url = this.token.split('.')[1];
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

  get serializedClaims(): string {
    const c = this.claims;
    let r = '';
    for (const name in c) {
      if (c[name].push) {
        for (const item of c[name]) {
          r += `;${name}=${item}`;
        }
      } else {
        r += `;${name}=${c[name]}`;
      }
    }
    return r.substr(1);
  }

  get(endpoint: string): Promise<any> {
    return this.sendRequest('GET', endpoint);
  }

  async sendRequest(method: string, endpoint: string): Promise<any> {
    try {
      const response = await fetch(endpoint, { method, cache: 'no-cache' });
      return await response.json();
    } catch (err) {
      console.error('Geins auth client error', err);
    }
  }
}
