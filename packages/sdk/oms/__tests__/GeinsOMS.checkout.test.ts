import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';
import { randomCheckoutData } from '../../../../test/dataMock';
import { omsSettings, validSettings } from '../../../../test/globalSettings';

describe('GeinsOMS checkout (stateless)', () => {
  let geinsOMS: GeinsOMS;
  let cartId: string;
  const PAYMENT_METHOD_ID = 18;

  beforeEach(async () => {
    const geinsCore = new GeinsCore(validSettings);
    geinsOMS = new GeinsOMS(geinsCore);

    // Create a cart and add an item, store the cartId
    let cart = await geinsOMS.cart.create();
    cart = await geinsOMS.cart.addItem(cart.id, { skuId: omsSettings.skus.skuId1, quantity: 1 });
    cartId = cart.id;
    expect(cartId).toBeDefined();

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
    const token = await geinsOMS.checkout.createToken({ cartId });
    expect(token).toBeDefined();
    const parsedToken = await GeinsOMS.parseCheckoutToken(token as string);
    expect(parsedToken).toBeDefined();
    expect(parsedToken).toHaveProperty('cartId');
    expect(parsedToken).toHaveProperty('checkoutSettings');
    expect(parsedToken).toHaveProperty('geinsSettings');
    expect(parsedToken?.cartId).toBe(cartId);
  });

  it('should get a checkout', async () => {
    const checkout = await geinsOMS.checkout.get({ cartId });
    expect(checkout).toBeDefined();
  });

  it('should have a selected payment', async () => {
    const checkout = await geinsOMS.checkout.get({ cartId, paymentMethodId: PAYMENT_METHOD_ID });
    expect(checkout).toBeDefined();
    const paymentOptions = checkout?.paymentOptions;
    expect(paymentOptions).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: PAYMENT_METHOD_ID, isSelected: true })]),
    );
  });

  it('should validate checkout', async () => {
    const checkoutOptions = randomCheckoutData(PAYMENT_METHOD_ID);
    await geinsOMS.checkout.get({ cartId, checkoutOptions });

    const validateResult = await geinsOMS.checkout.validate({ cartId, checkoutOptions });
    expect(validateResult).toBeDefined();
    if (validateResult?.isValid === false) {
      console.error('Validation error:', validateResult);
    }
    expect(validateResult?.isValid).toBe(true);
  });

  it('should not validate checkout with missing payment', async () => {
    const checkoutOptions = randomCheckoutData();
    await geinsOMS.checkout.get({ cartId, checkoutOptions });
    const validateResult = await geinsOMS.checkout.validate({ cartId, checkoutOptions });
    expect(validateResult).toBeDefined();
    expect(validateResult?.isValid).toBe(false);
  });

  it('should create an order', async () => {
    const checkoutOptions = randomCheckoutData(PAYMENT_METHOD_ID);
    const orderCreateResult = await geinsOMS.checkout.createOrder({
      cartId,
      checkoutOptions,
    });

    expect(orderCreateResult).toBeDefined();
    expect(orderCreateResult?.created).toBe(true);
  });
});
