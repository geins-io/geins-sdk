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
    const area = await geinsCMS.area.getRaw({
      family: cmsSettings.area.family,
      areaName: cmsSettings.area.areaName,
    });
    expect(area).toBeDefined();
  });
});
