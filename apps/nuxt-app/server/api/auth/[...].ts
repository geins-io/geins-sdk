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

  if (authMethod === 'login') {
    return await login(username, password, rememberUser);
  } else if (authMethod === 'logout') {
    return await logout();
  } else if (authMethod === 'refresh') {
    return await refresh();
  } else {
    return nothing();
  }
});

const login = async (
  username: string,
  password: string,
  rememberUser: boolean,
) => {
  try {
    const credentials = { username, password, rememberUser };

    const user = await authService.login(credentials);

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

const refresh = async () => {
  try {
    const result = await authService.refresh();
    console.log('ts refresh result', result);
    return {
      status: 200,
      body: {
        data: result,
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
    status: 400,
    body: {
      message: 'Invalid request',
    },
  };
};
