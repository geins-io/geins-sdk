import { GeinsCore } from '@geins/core';
import { GeinsCRM } from '@geins/crm';
import { AuthService } from '../src/auth/authService';
import { AuthCredentials, AuthSettings } from '@geins/types';
import { randomString, randomUserData } from '../../../../test/dataMock';
import { validSettings, validUserCredentials } from '../../../../test/globalSettings';
import { setupMockFetchForInternalApi } from '../../../../test/setupAuthMockFetch';

type TestSetupOptions = {
  authSettings: AuthSettings;
  useMockFetch?: boolean;
};

function testGeinsCRM(options: TestSetupOptions) {
  const { authSettings, useMockFetch } = options;

  describe(`GeinsCRM Tests with AuthSettings - ${authSettings.clientConnectionMode}`, () => {
    let geinsCRM: GeinsCRM | undefined;

    beforeEach(() => {
      const geinsCore = new GeinsCore(validSettings);
      geinsCRM = new GeinsCRM(geinsCore, authSettings);

      if (useMockFetch) {
        const authService = new AuthService(geinsCore.endpoints.authSign, geinsCore.endpoints.auth);
        setupMockFetchForInternalApi(authService);
      }
    });

    afterEach(() => {
      jest.clearAllMocks();
      geinsCRM?.destroy();
    });

    it('should initialize GeinsCRM correctly', () => {
      expect(geinsCRM).toBeDefined();
    });

    it('should login a user with valid credentials', async () => {
      const credentials: AuthCredentials = {
        username: validUserCredentials.username,
        password: validUserCredentials.password,
        rememberUser: validUserCredentials.rememberUser,
      };

      const loginResult = await geinsCRM?.auth.login(credentials);

      expect(loginResult).toBeDefined();
      expect(loginResult).toHaveProperty('succeeded');
      expect(loginResult).toHaveProperty('tokens');
      expect(loginResult).toHaveProperty('user');
      expect(loginResult!.succeeded).toBe(true);
      expect(loginResult!.tokens).toBeDefined();
      expect(loginResult!.user).toBeDefined();
      expect(loginResult!.tokens).toHaveProperty('token');
      expect(loginResult!.tokens).toHaveProperty('refreshToken');
    });

    it('should not login a user with invalid credentials', async () => {
      const credentials: AuthCredentials = {
        username: validUserCredentials.username,
        password: validUserCredentials.password + '1',
      };

      const loginResult = await geinsCRM?.auth.login(credentials);

      expect(loginResult).toBeDefined();
      expect(loginResult).toHaveProperty('succeeded');
      expect(loginResult!.succeeded).toBe(false);
    });

    it('should register a user with credentials', async () => {
      const randomUsername = `${randomString(10).toLowerCase()}@test-user.com`;
      const randomPassword = randomString(10);

      const result = await geinsCRM?.user.create({
        username: randomUsername,
        password: randomPassword,
      });

      expect(result).toBeDefined();
      expect(result).toHaveProperty('succeeded');
      expect(result!.succeeded).toBe(true);
      expect(result).toHaveProperty('tokens');
      expect(result).toHaveProperty('user');
      expect(result!.user).toBeDefined();
      expect(result!.tokens).toBeDefined();
      expect(result!.user).toHaveProperty('username');
      expect(result!.user?.username).toBe(randomUsername);
    });

    it('should login a user and get user info with token', async () => {
      const credentials: AuthCredentials = {
        username: validUserCredentials.username,
        password: validUserCredentials.password,
      };

      const loginResult = await geinsCRM?.auth.login(credentials);
      expect(loginResult).toBeDefined();
      expect(loginResult!.succeeded).toBe(true);

      const userToken = loginResult!.tokens!.token!;

      // Get user with explicit token
      const user = await geinsCRM?.user.get(userToken);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('customerType');
      expect(user).toHaveProperty('address');
    });

    it('should login a user and update information with token', async () => {
      const credentials: AuthCredentials = {
        username: validUserCredentials.username,
        password: validUserCredentials.password,
      };

      const changedUserInfo = randomUserData();

      const loginResult = await geinsCRM?.auth.login(credentials);
      expect(loginResult).toBeDefined();
      expect(loginResult!.succeeded).toBe(true);

      const userToken = loginResult!.tokens!.token!;

      // Update user with explicit token
      const updateResult = await geinsCRM?.user.update(changedUserInfo, userToken);
      expect(updateResult).toBeDefined();
      expect(updateResult).toHaveProperty('email');
      expect(updateResult).toHaveProperty('personalId');
      expect(updateResult).toHaveProperty('gender');
      expect(updateResult).toHaveProperty('customerType');
      expect(updateResult).toHaveProperty('address');
    });

    it('should not return user with invalid refresh-token', async () => {
      const invalidToken = 'invalidToken';

      const isolatedCore = new GeinsCore(validSettings);
      const isolatedCRM = new GeinsCRM(isolatedCore, authSettings);

      const result = await isolatedCRM.auth.getUser(invalidToken);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('succeeded');
      expect(result!.succeeded).toBe(false);
    });

    it('should return user when using refresh-token to auth.getUser', async () => {
      const credentials: AuthCredentials = {
        username: validUserCredentials.username,
        password: validUserCredentials.password,
      };

      const loginResult = await geinsCRM?.auth.login(credentials);
      expect(loginResult).toBeDefined();
      expect(loginResult!.succeeded).toBe(true);
      expect(loginResult!.tokens).toBeDefined();
      expect(loginResult!.tokens?.token).toBeDefined();

      const refreshToken = loginResult!.tokens?.refreshToken!;

      const isolatedCore = new GeinsCore(validSettings);
      const isolatedCRM = new GeinsCRM(isolatedCore, authSettings);

      const authUser = await isolatedCRM.auth.getUser(refreshToken);
      expect(authUser).toBeDefined();
      expect(authUser?.succeeded).toBe(true);
      expect(authUser?.tokens?.refreshToken).toBeDefined();
    });

    it('should return true for authorized when using valid refresh-token', async () => {
      const credentials: AuthCredentials = {
        username: validUserCredentials.username,
        password: validUserCredentials.password,
      };

      const loginResult = await geinsCRM?.auth.login(credentials);
      expect(loginResult).toBeDefined();
      expect(loginResult!.succeeded).toBe(true);

      const refreshToken = loginResult!.tokens?.refreshToken!;

      const isolatedCore = new GeinsCore(validSettings);
      const isolatedCRM = new GeinsCRM(isolatedCore, authSettings);

      const authorized = await isolatedCRM.auth.authorized(refreshToken);
      expect(authorized).toBe(true);
    });

    it('should return false for authorized when using invalid refresh-token', async () => {
      const refreshToken = 'invalidtoken';

      const isolatedCore = new GeinsCore(validSettings);
      const isolatedCRM = new GeinsCRM(isolatedCore, authSettings);

      const authorized = await isolatedCRM.auth.authorized(refreshToken);
      expect(authorized).toBe(false);
    });
  });
}

const authSettingsVariations: TestSetupOptions[] = [
  {
    authSettings: {
      clientConnectionMode: 'Direct',
    },
  },
  {
    authSettings: {
      clientConnectionMode: 'Proxy',
      proxyUrl: '/api/auth',
    },
    useMockFetch: true,
  },
];

describe.each(authSettingsVariations)('GeinsCRM Auth', (options) => {
  testGeinsCRM(options);
});
