import type { GeinsSettings, GeinsMarketLanguageType } from '@geins/types';
import { logWrite, BaseApiService } from '@geins/core';

export abstract class BasePIMApiServicesService extends BaseApiService {
  constructor(
    client: any,
    geinsSettings: GeinsSettings,
    protected marketLanguage?: GeinsMarketLanguageType,
  ) {
    super(client, geinsSettings);
  }
}
