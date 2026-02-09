import { GeinsCore } from '@geins/core';
import { GeinsCRM } from '@geins/crm';
import { AuthService } from '../src/auth/authService';
import { AuthCredentials, AuthSettings } from '@geins/types';
import { cleanObject, randomUserData } from '../../../../test/dataMock';
import { validSettings, validUserCredentials } from '../../../../test/globalSettings';
import { setupMockFetchForInternalApi } from '../../../../test/setupAuthMockFetch';

type TestSetupOptions = {
  authSettings: AuthSettings;
  useMockFetch?: boolean;
};

function testGeinsCRM(options: TestSetupOptions) {
  const { authSettings, useMockFetch } = options;

  describe(`GeinsCRM User Tests with AuthSettings - ${authSettings.clientConnectionMode}`, () => {
    let geinsCRM: GeinsCRM;

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
    });

    it('should login a user and update information', async () => {
      const credentials: AuthCredentials = {
        username: validUserCredentials.username,
        password: validUserCredentials.password,
      };

      const changedUserInfo = randomUserData();

      const loginResult = await geinsCRM.auth.login(credentials);
      expect(loginResult).toBeDefined();
      expect(loginResult!.succeeded).toBe(true);

      const userToken = loginResult!.tokens!.token!;

      // Get user with explicit token
      const user = await geinsCRM.user.get(userToken);
      expect(user).toBeDefined();
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('customerType');
      expect(user).toHaveProperty('address');

      // Update user with explicit token
      const updateResult = await geinsCRM.user.update(changedUserInfo, userToken);
      expect(updateResult).toBeDefined();
      expect(updateResult).toHaveProperty('email');
      expect(updateResult).toHaveProperty('personalId');
      expect(updateResult).toHaveProperty('gender');
      expect(updateResult).toHaveProperty('customerType');
      expect(updateResult).toHaveProperty('address');

      expect(updateResult!.personalId).toBe(changedUserInfo.personalId);
      expect(updateResult!.gender).toBe(changedUserInfo.gender);
      expect(updateResult!.customerType).toBe(changedUserInfo.customerType);

      const cleanUpdateResult = cleanObject(updateResult);
      expect(cleanUpdateResult!.address).toEqual(changedUserInfo.address);
    });
  });
}

const authSettingsVariations: TestSetupOptions[] = [
  {
    authSettings: {
      clientConnectionMode: 'Direct',
    },
  },
];

describe.each(authSettingsVariations)('GeinsCRM User', (options) => {
  testGeinsCRM(options);
});
