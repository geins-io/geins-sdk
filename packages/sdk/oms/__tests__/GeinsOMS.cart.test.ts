import { GeinsCore, GeinsLogLevel, RuntimeContext } from '@geins/core';
import { GeinsOMS } from '@geins/oms';
import type { CartItemType } from '@geins/types';
import { omsSettings, validSettings } from '../../../../test/globalSettings';

describe('GeinsOMS cart', () => {
  let geinsOMS: GeinsOMS;

  beforeEach(() => {
    const geinsCore = new GeinsCore(validSettings);
    geinsOMS = new GeinsOMS(geinsCore);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should have id after created', async () => {
    expect(geinsOMS.cart.id).toBeUndefined();

    await geinsOMS.cart.create();
    expect(geinsOMS.cart.id).toBeDefined();
  });

  it('should have item when item added', async () => {
    await geinsOMS.cart.items.add({ skuId: omsSettings.skus.skuId1, quantity: 1 });
    expect(geinsOMS.cart.id).toBeDefined();
    const items = await geinsOMS.cart.items.get();
    expect(items?.length).toBe(1);
  });

  it('should have the correct quantity when items is added and removed', async () => {
    const skuId = omsSettings.skus.skuId2;

    let result = await geinsOMS.cart.items.add({ skuId });
    expect(result).toBe(true);
    expect(geinsOMS.cart.id).toBeDefined();

    const items = await geinsOMS.cart.items.get();
    expect(items).toEqual(expect.arrayContaining([expect.objectContaining({ skuId })]));

    // add another item with same sku
    result = await geinsOMS.cart.items.add({ skuId });
    expect(result).toBe(true);
    // add another item with same sku
    result = await geinsOMS.cart.items.add({ skuId });
    expect(result).toBe(true);
    // expect cart item with skue to have quantity 3
    const items2 = await geinsOMS.cart.items.get();
    expect(items2).toEqual(expect.arrayContaining([expect.objectContaining({ skuId, quantity: 3 })]));

    // add two items with same sku
    result = await geinsOMS.cart.items.add({ skuId, quantity: 3 });
    expect(result).toBe(true);

    // expect cart item with skue to have quantity 6
    const items3 = await geinsOMS.cart.items.get();
    expect(items3).toEqual(expect.arrayContaining([expect.objectContaining({ skuId, quantity: 6 })]));

    // remove one item with same sku
    result = await geinsOMS.cart.items.remove({ skuId });
    expect(result).toBe(true);
    // expect cart item with skue to have quantity 5
    const items4 = await geinsOMS.cart.items.get();
    expect(items4).toEqual(expect.arrayContaining([expect.objectContaining({ skuId, quantity: 5 })]));
  });

  it('should have set items when updated', async () => {
    const skuId = omsSettings.skus.skuId1;
    await geinsOMS.cart.items.add({ skuId: skuId, quantity: 1 });
    expect(geinsOMS.cart.id).toBeDefined();

    let items = await geinsOMS.cart.items.get();
    expect(items?.length).toBe(1);
    const item: CartItemType = {
      skuId: skuId,
      quantity: 3,
    };
    const result = await geinsOMS.cart.items.update({ item });
    expect(result).toBe(true);

    items = await geinsOMS.cart.items.get();
    expect(items).toEqual(expect.arrayContaining([expect.objectContaining({ skuId, quantity: 3 })]));
  });

  it('should remove item when item removed', async () => {
    const skuId = omsSettings.skus.skuId2;
    await geinsOMS.cart.items.add({ skuId: skuId, quantity: 2 });

    expect(geinsOMS.cart.id).toBeDefined();
    let items = await geinsOMS.cart.items.get();
    expect(items?.length).toBe(1);

    await geinsOMS.cart.items.remove({ skuId });
    await geinsOMS.cart.items.remove({ skuId });
    items = await geinsOMS.cart.items.get();
    expect(items?.length).toBe(0);
  });

  it('should update item', async () => {
    const skuId = omsSettings.skus.skuId1;
    await geinsOMS.cart.items.add({ skuId: skuId, quantity: 1 });

    expect(geinsOMS.cart.id).toBeDefined();
    let items = await geinsOMS.cart.items.get();
    expect(items?.length).toBe(1);

    // get item from cart
    const item = items?.find((item) => item.skuId === skuId);

    expect(item).toBeDefined();
    if (!item) return;
    // set new quantity
    item.quantity = 3;
    item.message = 'test message';
    geinsOMS.cart.items.update({ item: item });
    items = await geinsOMS.cart.items.get();
    expect(items).toEqual(
      expect.arrayContaining([expect.objectContaining({ skuId, quantity: 3, message: 'test message' })]),
    );
  });

  it('should have merchant data when set', async () => {
    type MerchantDataTemplate = {
      extraData: string;
      extraNumber?: number;
    };
    const myTemplate: MerchantDataTemplate = {
      extraData: '',
      extraNumber: 0,
    };

    const geinsCore_local = new GeinsCore(validSettings);
    const geinsOMS_local = new GeinsOMS(geinsCore_local, {
      omsSettings: { context: RuntimeContext.HYBRID, merchantDataTemplate: myTemplate },
    });

    geinsOMS_local.cart.merchantData.extraData = 'test';
    geinsOMS_local.cart.merchantData.extraNumber = 123;

    const result = await geinsOMS_local.cart.merchantData.save();
    expect(result).toBe(true);

    let merchantData = await geinsOMS_local.cart.merchantData;
    expect(merchantData).toEqual(expect.objectContaining({ extraData: 'test', extraNumber: 123 }));
  });

  it('should have merchant data when set without template', async () => {
    const geinsCore_local = new GeinsCore(validSettings);
    const geinsOMS_local = new GeinsOMS(geinsCore_local, {
      omsSettings: { context: RuntimeContext.HYBRID },
    });

    geinsOMS_local.cart.merchantData = { extraData: 'test', testdata: 'testdata' };

    const result = await geinsOMS_local.cart.merchantData.save();
    expect(result).toBe(true);

    let merchantData = await geinsOMS_local.cart.merchantData;

    expect(merchantData).toEqual(expect.objectContaining({ extraData: 'test', testdata: 'testdata' }));
  });

  it('should have honor template of merchant data when set', async () => {
    type MerchantDataTemplate = {
      extraData: string;
      extraNumber?: number;
    };
    const myTemplate: MerchantDataTemplate = {
      extraData: '',
      extraNumber: 0,
    };
    validSettings.logLevel = GeinsLogLevel.DEBUG;

    const geinsCore_local = new GeinsCore(validSettings);
    const geinsOMS_local = new GeinsOMS(geinsCore_local, {
      omsSettings: { context: RuntimeContext.HYBRID, merchantDataTemplate: myTemplate },
    });

    try {
      geinsOMS_local.cart.merchantData.otherData = 'otherData';
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should be able to complete cart', async () => {
    await geinsOMS.cart.items.add({ skuId: omsSettings.skus.skuId1, quantity: 1 });
    expect(geinsOMS.cart.id).toBeDefined();

    const result = await geinsOMS.cart.complete();
    expect(result).toBe(true);

    const cart = await geinsOMS.cart.get();
    expect(cart?.completed).toBe(true);
    expect(geinsOMS.cart.isReadOnly).toBe(true);
  });

  it('should be not be able to add items to complete cart', async () => {
    await geinsOMS.cart.items.add({ skuId: omsSettings.skus.skuId1, quantity: 1 });
    expect(geinsOMS.cart.id).toBeDefined();

    const result = await geinsOMS.cart.complete();
    expect(result).toBe(true);

    const cart = await geinsOMS.cart.get();
    expect(cart?.completed).toBe(true);
    expect(geinsOMS.cart.isReadOnly).toBe(true);

    const addResult = await geinsOMS.cart.items.add({ skuId: omsSettings.skus.skuId1, quantity: 1 });
    expect(addResult).toBe(false);

    const items = await geinsOMS.cart.items.get();
    expect(items?.length).toBe(1);
  });

  it('should copy cart but not load it', async () => {
    await geinsOMS.cart.items.add({ skuId: omsSettings.skus.skuId1, quantity: 1 });
    expect(geinsOMS.cart.id).toBeDefined();
    const orginalId = geinsOMS.cart.id;

    const result = await geinsOMS.cart.copy();
    expect(result).toBeDefined();

    const copyId = geinsOMS.cart.id;
    expect(orginalId).toBe(copyId);
  });

  it('should copy cart and load it', async () => {
    await geinsOMS.cart.items.add({ skuId: omsSettings.skus.skuId1, quantity: 1 });
    expect(geinsOMS.cart.id).toBeDefined();
    const orginalId = geinsOMS.cart.id;

    const c = await geinsOMS.cart.items.get();

    const result = await geinsOMS.cart.copy({ loadCopy: true });
    expect(result).toBeDefined();

    const copyId = geinsOMS.cart.id;
    expect(orginalId).not.toBe(copyId);
  });

  it('should accept promotion code and then remove promotion code', async () => {
    await geinsOMS.cart.items.add({ skuId: omsSettings.skus.skuId2, quantity: 1 });
    expect(geinsOMS.cart.id).toBeDefined();

    let cart = await geinsOMS.cart.get();

    const promoCode = omsSettings.promotionCodes.percentOff;
    const prompCodeApplyResult = await geinsOMS.cart.promotionCode.apply(promoCode);
    expect(prompCodeApplyResult).toBe(true);

    cart = await geinsOMS.cart.get();
    expect(cart?.appliedCampaigns?.some((c: any) => c.name === promoCode)).toBe(true);

    const discountBefore = cart?.summary?.total?.discountIncVat ?? 0;
    expect(discountBefore).toBeGreaterThan(0);

    await geinsOMS.cart.promotionCode.remove();
    cart = await geinsOMS.cart.get();

    expect(cart?.appliedCampaigns?.some((c: any) => c.name === promoCode)).toBe(false);

    const discountAfter = cart?.summary?.total?.discountIncVat ?? 0;
    expect(discountAfter).toBeLessThan(discountBefore);
  });

  it('should show applied campaign', async () => {
    await geinsOMS.cart.items.add({ skuId: omsSettings.skus.skuId1, quantity: 1 });
    await geinsOMS.cart.items.add({ skuId: omsSettings.skus.skuId2, quantity: 1 });
    await geinsOMS.cart.items.add({ skuId: omsSettings.skus.skuId3, quantity: 1 });

    expect(geinsOMS.cart.id).toBeDefined();
    let cart = await geinsOMS.cart.get();
    expect(cart?.appliedCampaigns?.length ?? 0).toBeGreaterThan(0);
  });
});
