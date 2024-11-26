import { GeinsCore } from '@geins/core';
import { GeinsCMS } from '../src/geinsCMS';

import { validSettings, cmsSettings } from '../../../../test/globalSettings';

describe('GeinsCMS', () => {
  let geinsCMS: GeinsCMS;

  beforeEach(() => {
    const geinsCore = new GeinsCore(validSettings);
    geinsCMS = new GeinsCMS(geinsCore);

    // Reset mocks before each test
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get widget area', async () => {
    const area: any = await geinsCMS.area.get({
      family: cmsSettings.area.family,
      areaName: cmsSettings.area.areaName,
    });
    expect(area).toBeDefined();
    expect(area.meta).toBeDefined();
    expect(area.tags).toBeDefined();
    expect(area.containers).toBeDefined();
  });

  it('should get a page with an alias', async () => {
    const page: any = await geinsCMS.page.get({
      alias: cmsSettings.page.alias,
    });
    expect(page).toBeDefined();
    expect(page.id).toBeDefined();
    expect(page.name).toBeDefined();
    expect(page.title).toBeDefined();
    expect(page.meta).toBeDefined();
    expect(page.tags).toBeDefined();
    expect(page.containers).toBeDefined();
  });
});
