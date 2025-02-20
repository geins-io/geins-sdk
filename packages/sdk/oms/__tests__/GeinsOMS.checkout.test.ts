import { GeinsCore } from '@geins/core';
import { randomCheckoutData } from '../../../../test/dataMock';
import { omsSettings, validSettings } from '../../../../test/globalSettings';
import { GeinsOMS } from '../src/geinsOMS';

describe('GeinsOMS cart', () => {
  let geinsOMS: GeinsOMS;
  const PAYEMENT_METHOD_ID = 18;

  beforeEach(async () => {
    const geinsCore = new GeinsCore(validSettings);
    geinsOMS = new GeinsOMS(geinsCore);
    await geinsOMS.cart.items.add({ skuId: omsSettings.skus.skuId1, quantity: 1 });
    expect(geinsOMS.cart.id).toBeDefined();

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw error if no cartId', async () => {
    const no_cart_geinsOms = new GeinsOMS(new GeinsCore(validSettings));
    await expect(no_cart_geinsOms.checkout.get()).rejects.toThrow('Cart ID is required for checkout');
  });

  it('should get a checkout', async () => {
    const checkout = await geinsOMS.checkout.get();
    expect(checkout).toBeDefined();
  });

  it('should get have a selected payment', async () => {
    const checkout = await geinsOMS.checkout.get({ paymentMethodId: PAYEMENT_METHOD_ID });
    expect(checkout).toBeDefined();
    const paymentOptions = checkout?.paymentOptions;
    expect(paymentOptions).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: PAYEMENT_METHOD_ID, isSelected: true })]),
    );
  });

  it('should get have a validate ', async () => {
    const checkoutOptions = randomCheckoutData(PAYEMENT_METHOD_ID);
    // neded to get the checkout before validate
    await geinsOMS.checkout.get({ checkoutOptions });
    const validateResult = await geinsOMS.checkout.validate({ checkoutOptions });
    expect(validateResult).toBeDefined();
    expect(validateResult?.isValid).toBe(true);
  });

  it('should get have a not-validate ', async () => {
    const checkoutOptions = randomCheckoutData();
    await geinsOMS.checkout.get({ checkoutOptions });
    const validateResult = await geinsOMS.checkout.validate({ checkoutOptions });
    expect(validateResult).toBeDefined();
    expect(validateResult?.isValid).toBe(false);
  });

  it('should create an order', async () => {
    const checkoutOptions = randomCheckoutData(PAYEMENT_METHOD_ID);
    const orderCreateResult = await geinsOMS.checkout.createOrder({
      cartId: geinsOMS.cart.id,
      checkoutOptions,
    });

    expect(orderCreateResult).toBeDefined();
    expect(orderCreateResult?.created).toBe(true);
  });
});
