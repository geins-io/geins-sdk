// /packages/sdk/crm/__tests__/GeinsCRM.auth.test.ts

import { GeinsCore, CookieService, AUTH_COOKIES } from '@geins/core';
import { AuthSettings, AuthCredentials } from '@geins/types';
import { GeinsCRM } from '../src/geinsCRM';
import { validSettings, validUserCredentials, expectedCookiesAuthAll } from '../../../../test/globalSettings';
import { setupMockFetchForInternalApi } from '../../../../test/setupAuthMockFetch';
import { randomString, randomUserData, cleanObject } from '../../../../test/dataMock';
import { AuthService } from '../src/auth/authService';

// Define type for test setup options
type TestSetupOptions = {
  authSettings: AuthSettings;
  useMockFetch?: boolean; // Flag to indicate if mock fetch should be used
};

/**
 * Shared function to test GeinsCRM with different AuthSettings configurations.
 * @param {TestSetupOptions} options - Contains the AuthSettings and other configuration flags.
 */
function testGeinsCRM(options: TestSetupOptions) {
  const { authSettings, useMockFetch } = options;

  describe(`GeinsCRM Tests with AuthSettings - ${authSettings.clientConnectionMode}`, () => {
    let setCookieSpy: jest.SpyInstance;
    let removeCookieSpy: jest.SpyInstance;
    let expectedMaxAge: number;

    let geinsCRM: GeinsCRM;

    beforeEach(() => {
      setCookieSpy = jest.spyOn(CookieService.prototype, 'set');
      removeCookieSpy = jest.spyOn(CookieService.prototype, 'remove');

      validUserCredentials.rememberUser = true;
      expectedMaxAge = validUserCredentials.rememberUser ? 604800 : 1800;

      // Initialize GeinsCore and GeinsCRM instance before each test
      const geinsCore = new GeinsCore(validSettings);
      geinsCRM = new GeinsCRM(geinsCore, authSettings);

      // If useMockFetch is true, set up mock fetch for internal API calls
      if (useMockFetch) {
        const authService = new AuthService(geinsCore.endpoints.authSign, geinsCore.endpoints.auth);
        setupMockFetchForInternalApi(authService);
      }
      setCookieSpy.mockClear();
    });

    afterEach(() => {
      // Clean up mocks after each test
      jest.clearAllMocks();
      setCookieSpy.mockClear();
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

      const loginResult = await geinsCRM.auth.login(credentials);

      expect(loginResult).toBeDefined();
      expect(loginResult).toHaveProperty('succeeded');
      expect(loginResult).toHaveProperty('tokens');
      expect(loginResult).toHaveProperty('user');
      expect(loginResult!.succeeded).toBe(true);
      expect(loginResult!.tokens).toBeDefined();
      expect(loginResult!.user).toBeDefined();
      expect(loginResult!.tokens).toHaveProperty('token');
      expect(loginResult!.tokens).toHaveProperty('refreshToken');

      // check cookie set calls
      const setCalls = setCookieSpy.mock.calls.map(call => call[0]);
      expectedCookiesAuthAll.forEach(expectedName => {
        expect(setCalls).toContainEqual(expect.objectContaining({ name: expectedName }));
      });
      expect(setCookieSpy).toHaveBeenCalledTimes(expectedCookiesAuthAll.length);
      // check remove calls
      const removeCalls = removeCookieSpy.mock.calls.map(call => call[0]);
      expect(removeCalls).toHaveLength(0);
    });

    it('should not login a user with invalid credentials', async () => {
      const credentials: AuthCredentials = {
        username: validUserCredentials.username,
        password: validUserCredentials.password + '1',
      };

      const loginResult = await geinsCRM.auth.login(credentials);

      expect(loginResult).toBeDefined();
      expect(loginResult).toHaveProperty('succeeded');
      expect(loginResult!.succeeded).toBe(false);

      // check cookies
      const setCalls = setCookieSpy.mock.calls.map(call => call[0]);
      expect(setCalls).toHaveLength(0);
      const removeCalls = removeCookieSpy.mock.calls.map(call => call[0]);
      expect(removeCalls).toHaveLength(expectedCookiesAuthAll.length);
    });

    it('should register a user with credentials', async () => {
      const randomUsername = `${randomString(10).toLowerCase()}@test-user.com`;
      const randomPassword = randomString(10);

      const result = await geinsCRM.user.create({
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

      // check cookies
      const setCalls = setCookieSpy.mock.calls.map(call => call[0]);
      expect(setCalls).toHaveLength(expectedCookiesAuthAll.length);
    });

    it('should login a user and update information', async () => {
      const credentials: AuthCredentials = {
        username: validUserCredentials.username,
        password: validUserCredentials.password,
      };

      // create random user data
      const changedUserInfo = randomUserData();

      const loginResult = await geinsCRM.auth.login(credentials);
      expect(loginResult).toBeDefined();
      expect(loginResult!.succeeded).toBe(true);

      // get user information
      const user = await geinsCRM.user.get();
      expect(user).toBeDefined();
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('customerType');
      expect(user).toHaveProperty('address');

      // update user information
      const updateResult = await geinsCRM.user.update(changedUserInfo);
      expect(updateResult).toBeDefined();
      expect(updateResult).toHaveProperty('email');
      expect(updateResult).toHaveProperty('personalId');
      expect(updateResult).toHaveProperty('gender');
      expect(updateResult).toHaveProperty('customerType');
      expect(updateResult).toHaveProperty('address');

      // check so that the user information has been updated
      expect(updateResult!.personalId).toBe(changedUserInfo.personalId);
      expect(updateResult!.gender).toBe(changedUserInfo.gender);
      expect(updateResult!.customerType).toBe(changedUserInfo.customerType);

      // clean address object and compare
      const cleanUpdateResult = cleanObject(updateResult);
      expect(cleanUpdateResult!.address).toEqual(changedUserInfo.address);
    });

    it('should not return user with invalid user-token', async () => {
      const invalidToken = 'invalidToken';

      const isolatedCore = new GeinsCore(validSettings);
      const isolatedCRM = new GeinsCRM(isolatedCore, authSettings);

      const user = await isolatedCRM.auth.get(invalidToken);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('succeeded');
      expect(user!.succeeded).toBe(false);

      const setCalls = setCookieSpy.mock.calls.map(call => call[0]);
      expect(setCalls).toHaveLength(0);
    });

    it('should return user when use refresh-token to auth.get', async () => {
      const credentials: AuthCredentials = {
        username: validUserCredentials.username,
        password: validUserCredentials.password,
      };

      const loginResult = await geinsCRM.auth.login(credentials);
      expect(loginResult).toBeDefined();
      expect(loginResult!.succeeded).toBe(true);
      expect(loginResult!.tokens).toBeDefined();
      expect(loginResult!.tokens?.token).toBeDefined();

      const refreshToken = loginResult!.tokens?.refreshToken;
      const validToken = loginResult!.tokens?.token;

      const isolatedCore = new GeinsCore(validSettings);
      const isolatedCRM = new GeinsCRM(isolatedCore, authSettings);

      const authUser = await isolatedCRM.auth.get(refreshToken);
      const latestRefreshToken = authUser?.tokens?.refreshToken;
      expect(authUser).toBeDefined();

      const setCalls = setCookieSpy.mock.calls.map(call => call[0]);
      const lastAuthRefreshTokenCookie = setCalls
        .reverse()
        .find(item => item.name === AUTH_COOKIES.REFRESH_TOKEN);
      const lastAuthRefreshToken = lastAuthRefreshTokenCookie?.payload;

      expect(latestRefreshToken).toBe(lastAuthRefreshToken);

      // no remove calls
      const removeCalls = removeCookieSpy.mock.calls.map(call => call[0]);
      expect(removeCalls).toHaveLength(0);
    });

    it('should return true for authorized when using valid refresh-token', async () => {
      const credentials: AuthCredentials = {
        username: validUserCredentials.username,
        password: validUserCredentials.password,
      };

      const loginResult = await geinsCRM.auth.login(credentials);
      expect(loginResult).toBeDefined();
      expect(loginResult!.succeeded).toBe(true);

      const refreshToken = loginResult!.tokens?.refreshToken;

      const isolatedCore = new GeinsCore(validSettings);
      const isolatedCRM = new GeinsCRM(isolatedCore, authSettings);

      const authorized = await isolatedCRM.auth.authorized(refreshToken);
      expect(authorized).toBe(true);

      const setCalls = setCookieSpy.mock.calls.map(call => call[0]);
      expectedCookiesAuthAll.forEach(expectedName => {
        expect(setCalls).toContainEqual(expect.objectContaining({ name: expectedName }));
      });
    });

    it('should return false and remove cookies for authorized when using invalid refresh-token', async () => {
      const refreshToken = 'invalidtoken';

      const isolatedCore = new GeinsCore(validSettings);
      const isolatedCRM = new GeinsCRM(isolatedCore, authSettings);

      const authorized = await isolatedCRM.auth.authorized(refreshToken);
      expect(authorized).toBe(false);

      const setCalls = setCookieSpy.mock.calls.map(call => call[0]);
      expect(setCalls).toHaveLength(0);
      const removeCalls = removeCookieSpy.mock.calls.map(call => call[0]);
      expectedCookiesAuthAll.forEach(expectedName => {
        expect(removeCalls).toContainEqual(expect.stringContaining(expectedName));
      });
    });
  });
}

// Define different AuthSettings configurations to test with
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

// Use describe.each to run the test suite with different configurations
describe.each(authSettingsVariations)('GeinsCRM Auth', options => {
  testGeinsCRM(options);
});
