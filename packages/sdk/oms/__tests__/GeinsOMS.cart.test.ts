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

  it('should have item when item added', async () => {
    await geinsOMS.cart.add({ item: { skuId: omsSettings.skus.skuId1, quantity: 1 } });
    expect(geinsOMS.cart.id).toBeDefined();
    const items = await geinsOMS.cart.items;
    expect(items.length).toBe(1);
  });

  it('should have set itemes when updated', async () => {
    await geinsOMS.cart.add({ item: { skuId: omsSettings.skus.skuId1, quantity: 1 } });
    expect(geinsOMS.cart.id).toBeDefined();

    const items = await geinsOMS.cart.items;
    expect(items.length).toBe(1);

    await geinsOMS.cart.update({ item: { skuId: omsSettings.skus.skuId1, quantity: 5 } });
    const updatedItems = await geinsOMS.cart.items;
    expect(updatedItems.length).toBe(1);
    expect(updatedItems[0].quantity).toBe(5);

    //update item with new quantity using id
    const id = updatedItems[0].id;
    await geinsOMS.cart.update({ item: { id, quantity: 10 } });
    const updatedItems2 = await geinsOMS.cart.items;
    expect(updatedItems2.length).toBe(1);
    expect(updatedItems2[0].quantity).toBe(10);
  });

  it('should remove item when item removed', async () => {
    await geinsOMS.cart.add({ item: { skuId: omsSettings.skus.skuId1, quantity: 2 } });
    expect(geinsOMS.cart.id).toBeDefined();
    const items = await geinsOMS.cart.items;
    expect(items.length).toBe(1);

    const item = items[0];
    expect(item.quantity).toBe(2);

    await geinsOMS.cart.remove({ item });
  });
});
