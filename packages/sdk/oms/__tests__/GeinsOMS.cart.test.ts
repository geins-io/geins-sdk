import { GeinsOMS } from '../src/geinsOMS';
import { GeinsCore } from '@geins/core';
import type { CartItemInputType } from '@geins/types';

import { validSettings, cmsSettings, omsSettings } from '../../../../test/globalSettings';
import exp from 'constants';

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

  /*   it('should have item when item added', async () => {
    await geinsOMS.cart.items.add({ skuId: omsSettings.skus.skuId1, quantity: 1 });
    expect(geinsOMS.cart.id).toBeDefined();
    const items = await geinsOMS.cart.items.get();
    expect(items.length).toBe(1);
  }); */

  it('should have the correct quantity when items is added and removed', async () => {
    const skuId = omsSettings.skus.skuId2;

    let result = await geinsOMS.cart.items.add({ skuId });
    expect(result).toBe(true);
    expect(geinsOMS.cart.id).toBeDefined();

    const items = await geinsOMS.cart.items.get();
    expect(items).toEqual(expect.arrayContaining([expect.objectContaining({ skuId })]));

    result = await geinsOMS.cart.items.remove({ skuId });
    expect(result).toBe(true);

    /*
    // expect cart item with skue to have quantity 5
    const items4 = await geinsOMS.cart.items.get();
    console.log('--- items4', items4);
    expect(items4).toEqual(expect.arrayContaining([!expect.objectContaining({ skuId })])); */
  });

  /*

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
    console.log('--- remove result', result);
    expect(result).toBe(true);
    // expect cart item with skue to have quantity 5
    const items4 = await geinsOMS.cart.items.get();
    expect(items4).toEqual(expect.arrayContaining([expect.objectContaining({ skuId, quantity: 5 })]));
  });

  /*
  it('should have set itemes when updated', async () => {
    await geinsOMS.cart.items.add({ item: { skuId: omsSettings.skus.skuId1, quantity: 1 } });
    expect(geinsOMS.cart.id).toBeDefined();

    const items = await geinsOMS.cart.items.get();
    expect(items.length).toBe(1);

    await geinsOMS.cart.items.update({ item: { skuId: omsSettings.skus.skuId1, quantity: 5 } });
    const updatedItems = await geinsOMS.cart.items.get();
    expect(updatedItems.length).toBe(1);
    expect(updatedItems[0].quantity).toBe(5);

    //update item with new quantity using id
    const id = updatedItems[0].id;
    await geinsOMS.cart.items.update({ item: { id, quantity: 10 } });
    const updatedItems2 = await geinsOMS.cart.items.get();
    expect(updatedItems2.length).toBe(1);
    expect(updatedItems2[0].quantity).toBe(10);
  });

  it('should remove item when item removed', async () => {
    await geinsOMS.cart.add({ item: { skuId: omsSettings.skus.skuId1, quantity: 2 } });
    expect(geinsOMS.cart.id).toBeDefined();
    let items = await geinsOMS.cart.items;
    expect(items.length).toBe(1);

    let item = items[0];
    expect(item.quantity).toBe(2);
    // set item quantity to 1 to remove item
    // item.quantity = 1;
    await geinsOMS.cart.add({ item });

    items = await geinsOMS.cart.items;
    item = items[0];
    expect(items.length).toBe(1);
  });
  */
});
