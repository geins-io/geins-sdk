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

  it('cart service should expose stateless methods', () => {
    expect(oms.cart.create).toBeDefined();
    expect(typeof oms.cart.create).toBe('function');

    expect(oms.cart.get).toBeDefined();
    expect(typeof oms.cart.get).toBe('function');

    expect(oms.cart.copy).toBeDefined();
    expect(typeof oms.cart.copy).toBe('function');

    expect(oms.cart.complete).toBeDefined();
    expect(typeof oms.cart.complete).toBe('function');

    expect(oms.cart.addItem).toBeDefined();
    expect(typeof oms.cart.addItem).toBe('function');

    expect(oms.cart.updateItem).toBeDefined();
    expect(typeof oms.cart.updateItem).toBe('function');

    expect(oms.cart.deleteItem).toBeDefined();
    expect(typeof oms.cart.deleteItem).toBe('function');

    expect(oms.cart.setPromotionCode).toBeDefined();
    expect(typeof oms.cart.setPromotionCode).toBe('function');

    expect(oms.cart.removePromotionCode).toBeDefined();
    expect(typeof oms.cart.removePromotionCode).toBe('function');

    expect(oms.cart.setShippingFee).toBeDefined();
    expect(typeof oms.cart.setShippingFee).toBe('function');

    expect(oms.cart.setMerchantData).toBeDefined();
    expect(typeof oms.cart.setMerchantData).toBe('function');
  });

  it('order service should expose methods', () => {
    expect(oms.order.get).toBeDefined();
    expect(typeof oms.order.get).toBe('function');
  });
});
