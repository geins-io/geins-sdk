import type { GeinsCredentials, MarketLanguageType } from '@geins/types';
import { logWrite, BaseApiService } from '@geins/core';

export abstract class BasePIMApiServicesService extends BaseApiService {
  constructor(
    client: any,
    credentials: GeinsCredentials,
    protected marketLanguage?: MarketLanguageType,
  ) {
    super(client, credentials);
  }
}
