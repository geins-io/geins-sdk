/*
Might be an options for the gein-nuxt module?
https://nuxt.com/docs/getting-started/data-fetching#passing-headers-and-cookies
https://nuxt.com/docs/getting-started/data-fetching#pass-cookies-from-server-side-api-calls-on-ssr-response

set refreshgetToken in cookie named 'refresh' to pass for the next request
*/

import { MerchantApiCredentials, buildEndpoints, GeinsCore } from '@geins/core';
import { AuthService } from '@geins/auth';
import type {
  Channel,
  ContentAreaVariables,
  MenuType,
  ContentAreaType,
} from '@geins/types';

const runtimeConfig = useRuntimeConfig();
const channel: Channel = {
  siteId: runtimeConfig.public.channel.siteId,
  siteTopDomain: runtimeConfig.public.channel.siteTopDomain,
};

const geinsCredentials: MerchantApiCredentials = {
  ...runtimeConfig.public.geins,
};
const endpoints = buildEndpoints(
  geinsCredentials.accountName,
  geinsCredentials.apiKey,
  'prod',
);

const languageId = runtimeConfig.public.defaultLanguage;
const marketId = runtimeConfig.public.defaultMarket;

const geinsCore = new GeinsCore(geinsCredentials, channel, {
  marketId,
  languageId,
});

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
  let newPassword = '';
  let rememberUser = false;
  let resetPassword = false;

  if (method === 'GET') {
    const qs = getQuery(event);
    username = qs.username?.toString() ?? '';
    password = qs.password?.toString() ?? '';
    newPassword = qs.newPassword?.toString() ?? '';
    rememberUser = Boolean(qs.rememberUser) ?? false;
    resetPassword = Boolean(qs.resetPassword) ?? false;
  } else {
    const body = await readBody(event);
    if (body) {
      username = body.username;
      password = body.password;
      newPassword = body.newPassword;
      rememberUser = body.rememberUser;
      resetPassword = body.resetPassword;
    }
  }

  if (authMethod === 'login') {
    return await login(event, username, password, rememberUser);
  } else if (authMethod === 'logout') {
    const result = await logout();
    refreshCookieTokenClear(event);
    return result;
  } else if (authMethod === 'refresh') {
    return await refresh(event);
  } else if (authMethod === 'user') {
    return await getUser(event);
  } else if (authMethod === 'token') {
    hasRefreshTokenCookie(event);
    return nothing();
  } else if (authMethod === 'password') {
    return await changePassword(
      event,
      username,
      password,
      newPassword,
      rememberUser,
    );
  } else {
    return nothing();
  }
});

const changePassword = async (
  event: any,
  username: string,
  password: string,
  newPassword: string,
  rememberUser: boolean,
) => {
  try {
    const credentials = { username, password, newPassword, rememberUser };
    const authReponse = await authService.changePassword(credentials);
    if (authReponse.tokens && authReponse.tokens.refreshToken) {
      refreshCookieTokenSet(event, authReponse.tokens.refreshToken);
    }

    return {
      status: authReponse.succeeded ? 200 : 401,
      body: {
        data: authReponse,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      body: {
        message: 'Change Password failed',
        error: error.message,
      },
    };
  }
};

const login = async (
  event: any,
  username: string,
  password: string,
  rememberUser: boolean,
) => {
  try {
    const credentials = { username, password, rememberUser };
    const authReponse = await authService.login(credentials);
    if (authReponse.tokens !== undefined && authReponse.tokens.refreshToken) {
      refreshCookieTokenSet(event, authReponse.tokens.refreshToken);
    }
    return {
      status: authReponse.user?.authenticated ? 200 : 401,
      body: {
        data: authReponse,
      },
    };
  } catch (error: any) {
    return {
      status: 500,
      body: {
        message: 'Login failed',
      },
    };
  }
};

const logout = async () => {
  try {
    const authReponse = await authService.logout();
    return {
      status: authReponse.succeeded ? 200 : 500,
      body: {
        data: authReponse,
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

const getUser = async (event: any) => {
  try {
    const authReponse = await authService.getUser();
    if (
      authReponse &&
      authReponse?.tokens &&
      authReponse?.tokens?.refreshToken
    ) {
      refreshCookieTokenSet(event, authReponse.tokens.refreshToken);
    }

    return {
      status: authReponse?.succeeded ? 200 : 401,
      body: {
        data: authReponse,
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

const refresh = async (event: any) => {
  try {
    const authReponse = await authService.refresh();

    if (
      authReponse.succeeded &&
      authReponse.tokens &&
      authReponse.tokens.refreshToken
    ) {
      refreshCookieTokenSet(event, authReponse.tokens.refreshToken);
    }
    return {
      status: authReponse.succeeded ? 200 : 401,
      body: {
        data: authReponse,
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

const hasRefreshTokenCookie = async (event: any) => {
  const cookies = event.req.headers.cookie || '';
  const refreshCookie = cookies
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
  event.res.setHeader(
    'Set-Cookie',
    `refresh=; Path=/; HttpOnly; Secure; SameSite=None; Max-Age=0`,
  );
};
