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
  const {
    username = '',
    password = '',
    rememberUser = false,
  }: AuthApiQuery = method === 'GET'
    ? await getQuery(event)
    : await readBody(event);

  if (authMethod === 'login') {
    return await login(username, password, rememberUser);
  } else if (authMethod === 'logout') {
    return await logout();
  } else if (authMethod === 'status') {
    return await status();
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

const status = async () => {
  try {
    const isAuthenticated = await authService.status();
    return {
      status: 200,
      body: {
        authenticated: isAuthenticated,
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
