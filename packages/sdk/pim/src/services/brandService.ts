import type { GeinsSettings } from '@geins/core';
import { BaseApiService } from '@geins/core';
// import { queries } from '../graphql';

export class BrandService extends BaseApiService {
  constructor(apiClient: any, geinsSettings: GeinsSettings, _settings: any) {
    super(apiClient, geinsSettings);
  }
}
