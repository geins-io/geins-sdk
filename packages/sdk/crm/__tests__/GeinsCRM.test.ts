// /packages/sdk/cms/__tests__/GeinsCRM.test.ts

import { GeinsCore } from '@geins/core';
import {
  AuthSettings,
  AuthCredentials,
  AuthResponse,
  GeinsUserInputTypeType,
  GeinsAddressType,
} from '@geins/types';
import { GeinsCRM } from '../src/geinsCRM';
import {
  validSettings,
  validUserCredentials,
} from '../../../../test/globalSettings';
import {
  randomString,
  randomInt,
  randomNumber,
  randomAddress,
  randomUserData,
  cleanObject,
} from '../../../../test/dataMock';

describe('GeinsCRM', () => {
  const authSettings: AuthSettings = {
    clientConnectionMode: 'Direct',
  };

  let geinsCRM: GeinsCRM;

  beforeEach(() => {
    // Initialize GeinsCRM instance before each test
    const geinsCore = new GeinsCore(validSettings);
    geinsCRM = new GeinsCRM(geinsCore, authSettings);
  });

  afterEach(() => {
    // Clean up mocks after each test
    jest.clearAllMocks();
  });

  it('should initialize GeinsCRM correctly', () => {
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

    // clean adress object and compare
    const cleanUpdateResult = cleanObject(updateResult);
    expect(cleanUpdateResult!.address).toEqual(changedUserInfo.address);
  });

  it('if user-token and user-token is present and used with api calls', async () => {
    const credentials: AuthCredentials = {
      username: validUserCredentials.username,
      password: validUserCredentials.password,
    };
    const loginResult = await geinsCRM.auth.login(credentials);
    expect(loginResult).toBeDefined();
    expect(loginResult!.succeeded).toBe(true);
    expect(loginResult!.tokens).toBeDefined();
    expect(loginResult!.tokens?.token).toBeDefined();
    const validToken = loginResult!.tokens?.token;

    const isloatedCore = new GeinsCore(validSettings);
    const isolatedCRM = new GeinsCRM(isloatedCore, authSettings);

    const user = await isolatedCRM.user.get(validToken);
    expect(user).toBeDefined();

    const userTokenFromCore = isloatedCore.getUserToken();
    expect(userTokenFromCore).toBe(validToken);
  });

  it('if user-token is present but invalid and used with api calls', async () => {
    const invalidToken = 'invalidToken';

    const isloatedCore = new GeinsCore(validSettings);
    const isolatedCRM = new GeinsCRM(isloatedCore, authSettings);

    const user = await isolatedCRM.user.get(invalidToken);
    console.log(user);
    expect(user).toBeUndefined();
  });

  it('if refresh-token is present get user-token to used with api calls', async () => {
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

    const isloatedCore = new GeinsCore(validSettings);
    const isolatedCRM = new GeinsCRM(isloatedCore, authSettings);

    const authUser = await isolatedCRM.auth.getUser(refreshToken);
    expect(authUser).toBeDefined();

    const userTokenFromCore = isloatedCore.getUserToken();
    expect(userTokenFromCore).toBe(validToken);
  });

  it('if refresh-token is present get the user-token to used with api calls', async () => {
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

    const isloatedCore = new GeinsCore(validSettings);
    const isolatedCRM = new GeinsCRM(isloatedCore, authSettings);

    const authUser = await isolatedCRM.auth.refresh(refreshToken);
    const tokens = authUser?.tokens;
    expect(tokens).toBeDefined();

    expect(authUser).toBeDefined();

    const userTokenFromCore = isloatedCore.getUserToken();
    expect(userTokenFromCore).toBe(tokens?.token);
  });
});
