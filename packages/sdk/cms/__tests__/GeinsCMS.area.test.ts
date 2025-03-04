import { GeinsCMS } from '@geins/cms';
import { GeinsCore } from '@geins/core';

import { cmsSettings, validSettings } from '../../../../test/globalSettings';

describe('GeinsCMS area', () => {
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
});
