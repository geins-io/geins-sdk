import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';

// Mock the GeinsCore class
jest.mock('@geins/core');

describe('GeinsOMS Shape', () => {
  let mockCore: GeinsCore;
  let oms: GeinsOMS;

  beforeEach(() => {
    // Create a mock instance of GeinsCore
    mockCore = new GeinsCore({} as any);
    oms = new GeinsOMS(mockCore);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should use the correct client and settings from GeinsCore', () => {
    expect(oms.cart).toBeDefined();
    expect(typeof oms.cart).toBe('object');

    expect(oms.checkout).toBeDefined();
    expect(typeof oms.checkout).toBe('object');

    expect(oms.order).toBeDefined();
    expect(typeof oms.order).toBe('object');

    expect(oms.createCheckoutToken).toBeDefined();
    expect(typeof oms.createCheckoutToken).toBe('function');
  });

  it('checkout service should expose methods', () => {
    expect(oms.checkout.get).toBeDefined();
    expect(typeof oms.checkout.get).toBe('function');

    expect(oms.checkout.validate).toBeDefined();
    expect(typeof oms.checkout.validate).toBe('function');

    expect(oms.checkout.createOrder).toBeDefined();
    expect(typeof oms.checkout.createOrder).toBe('function');

    expect(oms.checkout.summary).toBeDefined();
    expect(typeof oms.checkout.summary).toBe('function');

    expect(oms.checkout.createToken).toBeDefined();
    expect(typeof oms.checkout.createToken).toBe('function');

    expect(oms.checkout.generateExternalCheckoutUrlParameters).toBeDefined();
    expect(typeof oms.checkout.generateExternalCheckoutUrlParameters).toBe('function');
  });

  it('cart service should expose methods', () => {
    expect(oms.cart.create).toBeDefined();
    expect(typeof oms.cart.create).toBe('function');

    expect(oms.cart.get).toBeDefined();
    expect(typeof oms.cart.get).toBe('function');

    expect(oms.cart.refresh).toBeDefined();
    expect(typeof oms.cart.refresh).toBe('function');

    expect(oms.cart.copy).toBeDefined();
    expect(typeof oms.cart.copy).toBe('function');

    expect(oms.cart.complete).toBeDefined();
    expect(typeof oms.cart.complete).toBe('function');

    expect(oms.cart.remove).toBeDefined();
    expect(typeof oms.cart.remove).toBe('function');

    expect(oms.cart.merchantData).toBeDefined();
    expect(typeof oms.cart.merchantData).toBe('object');

    // items
    expect(oms.cart.items).toBeDefined();
    expect(typeof oms.cart.items).toBe('object');

    expect(oms.cart.items.get).toBeDefined();
    expect(typeof oms.cart.items.get).toBe('function');

    expect(oms.cart.items.update).toBeDefined();
    expect(typeof oms.cart.items.update).toBe('function');

    expect(oms.cart.items.remove).toBeDefined();
    expect(typeof oms.cart.items.remove).toBe('function');

    expect(oms.cart.items.add).toBeDefined();
    expect(typeof oms.cart.items.add).toBe('function');

    expect(oms.cart.items.remove).toBeDefined();
    expect(typeof oms.cart.items.remove).toBe('function');
  });

  it('order service should expose methods', () => {
    expect(oms.order.get).toBeDefined();
    expect(typeof oms.order.get).toBe('function');
  });
});
