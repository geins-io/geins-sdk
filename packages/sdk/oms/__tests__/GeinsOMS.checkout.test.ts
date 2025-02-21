import { GeinsCore } from '@geins/core';
import { randomCheckoutData } from '../../../../test/dataMock';
import { omsSettings, validSettings } from '../../../../test/globalSettings';
import { GeinsOMS } from '../src/geinsOMS';
import { CheckoutService } from '../src/services';

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

  it('should throw error if no cartId when getting checkout', async () => {
    const no_cart_geinsOms = new GeinsOMS(new GeinsCore(validSettings));
    await expect(no_cart_geinsOms.checkout.get()).rejects.toThrow('Missing cartId');
  });

  it('should throw error if no cartId when creating token', async () => {
    const no_cart_geinsOms = new GeinsOMS(new GeinsCore(validSettings));
    await expect(no_cart_geinsOms.checkout.createToken()).rejects.toThrow('Missing cartId');
  });

  it('should create a token and then parse it', async () => {
    const token = await geinsOMS.checkout.createToken();
    expect(token).toBeDefined();
    const parsedToken = await CheckoutService.parseToken(token as string);
    expect(parsedToken).toBeDefined();
    expect(parsedToken).toHaveProperty('cartId');
    expect(parsedToken).toHaveProperty('checkoutSettings');
    expect(parsedToken).toHaveProperty('geinsSettings');
    expect(parsedToken?.cartId).toBe(geinsOMS.cart.id);
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

  it('should validate checkout checkout', async () => {
    // needed to get the checkout before validate
    const checkoutOptions = randomCheckoutData(PAYEMENT_METHOD_ID);
    await geinsOMS.checkout.get({ checkoutOptions });

    const validateResult = await geinsOMS.checkout.validate({ checkoutOptions });
    expect(validateResult).toBeDefined();
    expect(validateResult?.isValid).toBe(true);
  });

  it('should get not validate checkout', async () => {
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
