// /packages/sdk/cms/__tests__/GeinsCRM.test.ts

import { GeinsCore } from '@geins/core';
import { AuthSettings, AuthCredentials, AuthResponse } from '@geins/types';
import { GeinsCRM } from '../src/geinsCRM';
import {
  validSettings,
  validUserCredentials,
} from '../../../../test/globalSettings';

function randomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

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

  /*  it('should register a user with credentials', async () => {
    const randomUsername = `${randomString(10).toLowerCase()}@test-user.com`;
    const randonmPassword = randomString(10);

    const credentials: AuthCredentials = {
      username: 'aaatest@test.se',
      password: 'randonmPassword',
    };

    const result = await geinsCRM.auth.newUser({
      username: randomUsername,
      password: 'randonmPassword',
    });
  }); */
});
