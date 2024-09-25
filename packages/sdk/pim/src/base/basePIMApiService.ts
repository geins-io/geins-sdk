import type { GeinsCredentials, GeinsMarketLanguageType } from '@geins/types';
import { logWrite, BaseApiService } from '@geins/core';

export abstract class BasePIMApiServicesService extends BaseApiService {
  constructor(
    client: any,
    credentials: GeinsCredentials,
    protected marketLanguage?: GeinsMarketLanguageType,
  ) {
    super(client, credentials);
  }
}
