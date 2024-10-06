// test-utils/setupMockFetch.ts
import 'node-fetch'; // Import node-fetch if you use it in your environment

async function login(authService: any, options: any): Promise<any> {
  const credentials = JSON.parse(options?.body as string);
  const authReponse = await authService.login(credentials);
  const retVal = new Response(
    JSON.stringify({
      status: 200,
      body: {
        data: authReponse,
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
  return retVal;
}

async function refresh(authService: any, options: any): Promise<any> {
  const refreshToken = options?.headers?.['x-auth-refresh-token'];
  const authReponse = await authService.refresh(refreshToken);
  const retVal = new Response(
    JSON.stringify({
      status: 200,
      body: {
        data: authReponse,
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
  return retVal;
}

async function getUser(authService: any, options: any): Promise<any> {
  const refreshToken = options?.headers?.['x-auth-refresh-token'];

  const authReponse = await authService.getUser(refreshToken);
  const retVal = new Response(
    JSON.stringify({
      status: 200,
      body: {
        data: authReponse,
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
  return retVal;
}

async function changePassword(authService: any, options: any): Promise<any> {
  const credentials = JSON.parse(options?.body as string);
  const authReponse = await authService.changePassword(credentials);
  const retVal = new Response(
    JSON.stringify({
      status: 200,
      body: {
        data: authReponse,
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
  return retVal;
}

async function register(authService: any, options: any): Promise<any> {
  const credentials = JSON.parse(options?.body as string);
  const authReponse = await authService.register(credentials);
  const retVal = new Response(
    JSON.stringify({
      status: 200,
      body: {
        data: authReponse,
      },
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
  return retVal;
}

export const setupMockFetchForInternalApi = (authService: any) => {
  global.fetch = jest.fn(async (url: RequestInfo, options?: RequestInit) => {
    // Check if the URL is an internal API request
    if (typeof url === 'string' && url.startsWith('/api/')) {
      switch (url) {
        case '/api/auth/login':
          return await login(authService, options);
        case '/api/auth/refesh':
          return await refresh(authService, options);
        case '/api/auth/user':
          return await getUser(authService, options);
        case '/api/auth/password':
          return await changePassword(authService, options);
        case '/api/auth/register':
          return await register(authService, options);
        default:
          return Promise.reject(new Error(`Unhandled internal API URL: ${url}`));
      }
    }

    // If it's not an internal URL, call the real `fetch` using `jest.requireActual`
    const actualFetch = jest.requireActual('node-fetch') as typeof fetch;
    return actualFetch(url, options);
  }) as jest.Mock;
};
