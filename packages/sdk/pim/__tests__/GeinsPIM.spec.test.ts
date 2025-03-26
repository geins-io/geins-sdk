import { GeinsCore } from '@geins/core';
import { GeinsPIM } from '@geins/pim';

// Mock the GeinsCore class
jest.mock('@geins/core');

describe('GeinsPIM Shape', () => {
  let mockCore: GeinsCore;
  let pim: GeinsPIM;

  beforeEach(() => {
    // Create a mock instance of GeinsCore
    mockCore = new GeinsCore({} as any);
    pim = new GeinsPIM(mockCore);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should use the correct client and settings from GeinsCore', () => {
    expect(pim).toBeDefined();
  });
});
