import { GeinsCore } from '@geins/core';
import { GeinsOMS } from '@geins/oms';
import type { CartType } from '@geins/types';
import { omsSettings, validSettings } from '../../../../test/globalSettings';

describe('GeinsOMS cart (stateless)', () => {
  let geinsOMS: GeinsOMS;

  beforeEach(() => {
    const geinsCore = new GeinsCore(validSettings);
    geinsOMS = new GeinsOMS(geinsCore);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a cart and return id', async () => {
    const cart = await geinsOMS.cart.create();
    expect(cart).toBeDefined();
    expect(cart.id).toBeDefined();
  });

  it('should add item and return cart with item', async () => {
    const cart = await geinsOMS.cart.create();
    const updatedCart = await geinsOMS.cart.addItem(cart.id, {
      skuId: omsSettings.skus.skuId1,
      quantity: 1,
    });

    expect(updatedCart).toBeDefined();
    expect(updatedCart.id).toBe(cart.id);
    expect(updatedCart.items?.length).toBe(1);
  });

  it('should increment quantity when adding same item', async () => {
    const skuId = omsSettings.skus.skuId2;

    let cart = await geinsOMS.cart.create();

    cart = await geinsOMS.cart.addItem(cart.id, { skuId, quantity: 1 });
    expect(cart.items).toEqual(expect.arrayContaining([expect.objectContaining({ skuId })]));

    // Add same item again — quantity should be 2
    cart = await geinsOMS.cart.addItem(cart.id, { skuId, quantity: 1 });
    expect(cart.items).toEqual(expect.arrayContaining([expect.objectContaining({ skuId, quantity: 2 })]));

    // Add 3 more — quantity should be 5
    cart = await geinsOMS.cart.addItem(cart.id, { skuId, quantity: 3 });
    expect(cart.items).toEqual(expect.arrayContaining([expect.objectContaining({ skuId, quantity: 5 })]));
  });

  it('should update item to exact quantity', async () => {
    const skuId = omsSettings.skus.skuId1;

    let cart = await geinsOMS.cart.create();
    cart = await geinsOMS.cart.addItem(cart.id, { skuId, quantity: 1 });
    expect(cart.items?.length).toBe(1);

    cart = await geinsOMS.cart.updateItem(cart.id, {
      skuId,
      quantity: 3,
      message: 'test message',
    });

    expect(cart.items).toEqual(
      expect.arrayContaining([expect.objectContaining({ skuId, quantity: 3, message: 'test message' })]),
    );
  });

  it('should delete item by setting quantity to 0', async () => {
    const skuId = omsSettings.skus.skuId2;

    let cart = await geinsOMS.cart.create();
    cart = await geinsOMS.cart.addItem(cart.id, { skuId, quantity: 2 });
    expect(cart.items?.length).toBe(1);

    // Delete item by setting quantity to 0
    cart = await geinsOMS.cart.updateItem(cart.id, { skuId, quantity: 0 });
    expect(cart.items?.length).toBe(0);
  });

  it('should delete item using deleteItem', async () => {
    const skuId = omsSettings.skus.skuId1;

    let cart = await geinsOMS.cart.create();
    cart = await geinsOMS.cart.addItem(cart.id, { skuId, quantity: 1 });
    expect(cart.items?.length).toBe(1);

    const itemId = cart.items[0].id!;
    cart = await geinsOMS.cart.deleteItem(cart.id, itemId);
    expect(cart.items?.length).toBe(0);
  });

  it('should set merchant data', async () => {
    let cart = await geinsOMS.cart.create();
    const merchantData = JSON.stringify({ extraData: 'test', extraNumber: 123 });

    cart = await geinsOMS.cart.setMerchantData(cart.id, merchantData);
    expect(cart).toBeDefined();
  });

  it('should complete cart', async () => {
    let cart = await geinsOMS.cart.create();
    cart = await geinsOMS.cart.addItem(cart.id, { skuId: omsSettings.skus.skuId1, quantity: 1 });

    cart = await geinsOMS.cart.complete(cart.id);
    expect(cart.completed).toBe(true);

    // Re-fetch to confirm
    cart = await geinsOMS.cart.get(cart.id);
    expect(cart.completed).toBe(true);
  });

  it('should copy cart and return new cart', async () => {
    let cart = await geinsOMS.cart.create();
    cart = await geinsOMS.cart.addItem(cart.id, { skuId: omsSettings.skus.skuId1, quantity: 1 });
    const originalId = cart.id;

    const copiedCart = await geinsOMS.cart.copy(cart.id);
    expect(copiedCart).toBeDefined();
    expect(copiedCart.id).not.toBe(originalId);
  });

  it('should apply and remove promotion code', async () => {
    let cart = await geinsOMS.cart.create();
    cart = await geinsOMS.cart.addItem(cart.id, { skuId: omsSettings.skus.skuId2, quantity: 1 });

    const promoCode = omsSettings.promotionCodes.percentOff;

    // Apply promotion code
    cart = await geinsOMS.cart.setPromotionCode(cart.id, promoCode);
    expect(cart.appliedCampaigns?.some((c) => c.name === promoCode)).toBe(true);

    const discountBefore = cart.summary?.total?.discountIncVat ?? 0;
    expect(discountBefore).toBeGreaterThan(0);

    // Remove promotion code
    cart = await geinsOMS.cart.removePromotionCode(cart.id);
    expect(cart.appliedCampaigns?.some((c) => c.name === promoCode)).toBe(false);

    const discountAfter = cart.summary?.total?.discountIncVat ?? 0;
    expect(discountAfter).toBeLessThan(discountBefore);
  });

  it('should show applied campaign', async () => {
    let cart = await geinsOMS.cart.create();
    cart = await geinsOMS.cart.addItem(cart.id, { skuId: omsSettings.skus.skuId1, quantity: 1 });
    cart = await geinsOMS.cart.addItem(cart.id, { skuId: omsSettings.skus.skuId2, quantity: 1 });
    cart = await geinsOMS.cart.addItem(cart.id, { skuId: omsSettings.skus.skuId3, quantity: 1 });

    expect(cart.appliedCampaigns?.length ?? 0).toBeGreaterThan(0);
  });
});
