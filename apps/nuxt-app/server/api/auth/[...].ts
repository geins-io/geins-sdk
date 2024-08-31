/*
Might be an options for the gein-nuxt module?
https://nuxt.com/docs/getting-started/data-fetching#passing-headers-and-cookies
https://nuxt.com/docs/getting-started/data-fetching#pass-cookies-from-server-side-api-calls-on-ssr-response

set refreshgetToken in cookie named 'refresh' to pass for the next request


*/

import { MerchantApiCredentials, buildEndpoints } from '@geins/core';
import { AuthService } from '../../../utils/authService';

const runtimeConfig = useRuntimeConfig();
const geinsCredentials: MerchantApiCredentials = {
  ...runtimeConfig.public.geins,
};
const endpoints = buildEndpoints(
  geinsCredentials.accountName,
  geinsCredentials.apiKey,
  'prod',
);

const authService = new AuthService(endpoints.authSign, endpoints.auth);
interface AuthApiQuery {
  method: string;
  username: string;
  password?: string;
  rememberUser?: boolean;
  resetPassword?: boolean;
  token?: string;
}

export default defineEventHandler(async (event) => {
  const refreshToken = await hasRefreshTokenCookie(event);
  if (refreshToken) {
    authService.setRefreshToken(refreshToken);
  }

  const params = event.context.params;
  if (!params) {
    return nothing();
  }

  const authMethod = params._;
  if (!authMethod) {
    return nothing();
  }

  const method = event.req.method;

  let username = '';
  let password = '';
  let rememberUser = false;
  let resetPassword = false;

  if (method === 'GET') {
    const qs = await getQuery(event);
    username = qs.username?.toString() ?? '';
    password = qs.password?.toString() ?? '';
    rememberUser = Boolean(qs.rememberUser) ?? false;
    resetPassword = Boolean(qs.resetPassword) ?? false;
  } else {
    const body = await readBody(event);
    if (body) {
      username = body.username;
      password = body.password;
      rememberUser = body.rememberUser;
      resetPassword = body.resetPassword;
    }
  }
  console.log('ts.. rememberUser:', rememberUser);

  if (authMethod === 'login') {
    return await login(event, username, password, rememberUser);
  } else if (authMethod === 'logout') {
    const result = await logout();
    refreshCookieTokenClear(event);
    return result;
  } else if (authMethod === 'refresh') {
    return await refresh(event);
  } else if (authMethod === 'token') {
    hasRefreshTokenCookie(event);
    return nothing();
  } else {
    return nothing();
  }
});

const hasRefreshTokenCookie = async (event: any) => {
  const cookies = event.req.headers.cookie || '';
  // console.log('hasRefreshTokenCookie() cookies:', cookies);
  const refreshCookie: string | undefined = cookies
    .split(';')
    .find((cookie: string) => cookie.trim().startsWith('refresh='));
  if (refreshCookie) {
    return refreshCookie.split('=')[1];
  } else {
    return '';
  }
};

const refreshCookieTokenSet = async (event: any, token: string) => {
  event.res.setHeader(
    'Set-Cookie',
    `refresh=${token}; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=900`,
  );
};

const refreshCookieTokenClear = async (event: any) => {
  console.log('CLEAR Token request');
  // refresh token is set as a cookie
  event.res.setHeader(
    'Set-Cookie',
    `refresh=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`,
  );
};

const login = async (
  event: any,
  username: string,
  password: string,
  rememberUser: boolean,
) => {
  try {
    const credentials = { username, password, rememberUser };
    const user = await authService.login(credentials);
    if (user.refreshToken) {
      refreshCookieTokenSet(event, user.refreshToken);
    }

    return {
      status: user.authenticated ? 200 : 401,
      body: {
        data: user,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      body: {
        message: 'Login failed',
        error: error.message,
      },
    };
  }
};

const logout = async () => {
  try {
    const success = await authService.logout();
    return {
      status: success ? 200 : 500,
      body: {
        message: success ? 'Logout successful' : 'Logout failed',
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      body: {
        message: 'Logout failed',
        error: error.message,
      },
    };
  }
};

const refresh = async (event: any) => {
  try {
    const { token, refreshToken } = await authService.refresh();
    console.log('refresh() Refresh Token:', refreshToken);
    if (refreshToken) {
      refreshCookieTokenSet(event, refreshToken);
    }

    return {
      status: 200,
      body: {
        data: token,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      body: {
        message: 'Failed to retrieve status',
        error: error.message,
      },
    };
  }
};

const nothing = async () => {
  return {
    status: 200,
    body: {
      message: 'Invalid request',
    },
  };
};
