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

  describe(`GeinsCRM User Tests with AuthSettings - ${authSettings.clientConnectionMode}`, () => {
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

    it('should login a user and update information', async () => {
      const credentials: AuthCredentials = {
        username: validUserCredentials.username,
        password: validUserCredentials.password,
      };

      // create random user data
      //const changedUserInfo = randomUserData();

      const loginResult = await geinsCRM.auth.login(credentials);
      expect(loginResult).toBeDefined();
      expect(loginResult!.succeeded).toBe(true);

      // get user information
      const user = await geinsCRM.user.get();
      // console.log('user', user);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('customerType');
      expect(user).toHaveProperty('address');

      /*
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
      */
    });
  });
}

// Define different AuthSettings configurations to test with
const authSettingsVariations: TestSetupOptions[] = [
  {
    authSettings: {
      clientConnectionMode: 'Direct',
    },
  } /* ,
  {
    authSettings: {
      clientConnectionMode: 'Proxy',
      proxyUrl: '/api/auth',
    },
    useMockFetch: true,
  }, */,
];

// Use describe.each to run the test suite with different configurations
describe.each(authSettingsVariations)('GeinsCRM User', options => {
  testGeinsCRM(options);
});
