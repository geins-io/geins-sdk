import { GeinsOMS } from '../src/geinsOMS';
import { GeinsCore, RuntimeContext, GeinsLogLevel } from '@geins/core';
import type { CartItemInputType, CartItemType, OMSSettings } from '@geins/types';

import { validSettings, omsSettings } from '../../../../test/globalSettings';

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

    result = await geinsOMS.cart.items.remove({ skuId });
    expect(result).toBe(true);
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
});
