import { GeinsOMS } from '../src/geinsOMS';
import { GeinsCore } from '@geins/core';

import { validSettings, cmsSettings } from '../../../../test/globalSettings';

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

  /*  it('should have id after created', () => {
    expect(geinsOMS.cart.idartId).toBeUndefined();

    geinsOMS.cart.create();
    expect(geinsOMS.cart.id).toBeDefined();

    console.log('id::', geinsOMS.cart.id);
  });

  it('should have items after added', async () => {
    geinsOMS.cart.create();
    expect(geinsOMS.cart.id).toBeDefined();

    const item = { id: 'item-id-123' };
    await geinsOMS.cart.add(item);
    const items = await geinsOMS.cart.get();

    expect(items).toContainEqual(item);
  }); */
});
