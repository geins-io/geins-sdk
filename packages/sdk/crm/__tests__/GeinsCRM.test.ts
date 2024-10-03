// /packages/sdk/cms/__tests__/GeinsCRM.test.ts

import { GeinsCore } from '@geins/core';
import {
  AuthSettings,
  AuthCredentials,
  AuthResponse,
  GeinsUserInputTypeType,
} from '@geins/types';
import { GeinsCRM } from '../src/geinsCRM';
import {
  validSettings,
  validUserCredentials,
} from '../../../../test/globalSettings';
import { randomString } from '../../../../test/dataMock';

describe('GeinsCRM', () => {
  const authSettings: AuthSettings = {
    clientConnectionMode: 'Direct',
  };

  let geinsCRM: GeinsCRM;
  let crmCore: GeinsCore;

  beforeEach(() => {
    // Initialize GeinsCRM instance before each test
    const geinsCore = new GeinsCore(validSettings);
    geinsCRM = new GeinsCRM(geinsCore, authSettings);
    crmCore = geinsCRM.getCore();
  });

  afterEach(() => {
    // Clean up mocks after each test
    jest.clearAllMocks();
  });

  /*   it('should initialize GeinsCRM correctly', () => {
    expect(geinsCRM).toBeDefined();
  });

  it('should login a user with valid credentials', async () => {
    const credentials: AuthCredentials = {
      username: validUserCredentials.username,
      password: validUserCredentials.password,
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
  });

  it('should register a user with credentials', async () => {
    const randomUsername = `${randomString(10).toLowerCase()}@test-user.com`;
    const randonmPassword = randomString(10);

    const result = await geinsCRM.auth.newUser({
      username: randomUsername,
      password: randonmPassword,
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
  }); */

  it('should login a user and update information', async () => {
    const credentials: AuthCredentials = {
      username: validUserCredentials.username,
      password: validUserCredentials.password,
    };
    const userTokenBeforeLogin = crmCore.getUserToken();
    console.log('*** userTokenBeforeLogin', userTokenBeforeLogin);

    const loginResult = await geinsCRM.auth.login(credentials);
    const userTokenAfterLogin = crmCore.getUserToken();

    console.log('*** userTokenAfterLogin', userTokenAfterLogin);

    expect(loginResult).toBeDefined();
    expect(loginResult!.succeeded).toBe(true);

    const user = await geinsCRM.user.get();

    // get user
    //
    // console.log('user', user);

    //await geinsCRM.user.update({username: 'test'}});
  });

  // OLIVA APP
  // CORE instance
  // CRM instance
  // CRM getUser with token --- make sure core has token after this
});
