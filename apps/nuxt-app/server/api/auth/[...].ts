import {
  logWrite,
  buildEndpoints,
  AUTH_COOKIES,
  AUTH_HEADERS,
} from '@geins/core';
import type { GeinsCredentials } from '@geins/types';
import { AuthService } from '@geins/crm';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const geinsCredentials = config.public.geins.credentials as GeinsCredentials;
  const endpoints = buildEndpoints(
    geinsCredentials.apiKey,
    geinsCredentials.accountName,
    geinsCredentials.environment,
  );
  const authService = new AuthService(endpoints.authSign, endpoints.auth);

  const login = async (
    username: string,
    password: string,
    rememberUser: boolean,
  ) => {
    try {
      const credentials = { username, password, rememberUser };
      const authReponse = await authService.login(credentials);

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

  const refresh = async (refreshToken: string) => {
    try {
      const authReponse = await authService.refresh(refreshToken);
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

  const getUser = async (refreshToken: string) => {
    try {
      const authReponse = await authService.getUser(refreshToken);
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

  const changePassword = async (
    username: string,
    password: string,
    newPassword: string,
    rememberUser: boolean,
    refreshToken: string,
  ) => {
    try {
      const credentials = { username, password, newPassword, rememberUser };
      const authReponse = await authService.changePassword(
        credentials,
        refreshToken,
      );

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

  const nothing = async () => {
    return {
      status: 200,
      body: {
        message: 'Invalid request',
      },
    };
  };

  const refreshToken = getHeader(event, AUTH_HEADERS.REFRESH_TOKEN);
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
    return await login(username, password, rememberUser);
  } else if (authMethod === 'refresh') {
    if (!refreshToken) {
      return nothing();
    }
    return await refresh(refreshToken);
  } else if (authMethod === 'user') {
    if (!refreshToken) {
      return nothing();
    }
    return await getUser(refreshToken);
  } else if (authMethod === 'password') {
    if (!refreshToken) {
      return nothing();
    }
    return await changePassword(
      username,
      password,
      newPassword,
      rememberUser,
      refreshToken,
    );
  } else {
    return nothing();
  }
});
