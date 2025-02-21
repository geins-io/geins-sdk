import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '../src/geinsOMS';

// Mock the GeinsCore class
jest.mock('@geins/core');

describe('GeinsOMS Class Spec', () => {
  let mockCore: GeinsCore;

  beforeEach(() => {
    // Create a mock instance of GeinsCore
    mockCore = new GeinsCore({} as any);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should use the correct client and settings from GeinsCore', () => {
    const oms = new GeinsOMS(mockCore);
    expect(oms.cart).toBeDefined();
    expect(oms.checkout).toBeDefined();
    expect(oms.order).toBeDefined();
  });
});
