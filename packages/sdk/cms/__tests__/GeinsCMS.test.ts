// packages/sdk/cms/__tests__/GeinsCMS.test.ts

import { GeinsCMS } from '../src/geinsCMS';
import { GeinsCore } from '@geins/core';
import { validSettings } from '../../../../test/globalSettings';

describe('GeinsCMS', () => {
  let geinsCMS: GeinsCMS;

  beforeEach(() => {
    // Initialize GeinsCMS instance before each test
    const geinsCore = new GeinsCore(validSettings);
    geinsCMS = new GeinsCMS(geinsCore);
  });

  afterEach(() => {
    // Clean up mocks after each test
    jest.clearAllMocks();
  });

  it('should initialize GeinsCMS correctly', () => {
    expect(geinsCMS).toBeDefined();
  });
});
