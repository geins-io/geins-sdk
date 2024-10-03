import type { GeinsSettings } from '@geins/types';
import {
  FetchPolicyOptions,
  MerchantApiClient,
  GraphQLQueryOptions,
} from '../api-client/merchantApiClient';

export abstract class BaseApiService {
  protected apiClient: MerchantApiClient;
  protected geinsSettings: GeinsSettings;
  protected channelId: string;

  constructor(apiClient: MerchantApiClient, geinsSettings: GeinsSettings) {
    this.apiClient = apiClient;

    if (!geinsSettings.channel) {
      throw new Error('Channel is required');
    }

    this.geinsSettings = geinsSettings;

    this.channelId = `${geinsSettings.channel}|${geinsSettings.tld}`;
  }

  protected createVariables(vars: any) {
    const variables = { ...vars };

    if (!variables.languageId) {
      if (!this.geinsSettings.locale) {
        throw new Error('Language is required');
      }
      variables.languageId = this.geinsSettings.locale;
    }

    if (!variables.marketId) {
      if (!this.geinsSettings.market) {
        throw new Error('Market is required');
      }
      variables.marketId = this.geinsSettings.market;
    }

    if (!variables.channelId) {
      variables.channelId = this.channelId;
    }

    return variables;
  }

  protected async runQuery(options: GraphQLQueryOptions) {
    if (!this.apiClient) {
      throw new Error('Merchant API Client is not set');
    }
    return this.apiClient.runQuery(options);
  }

  protected async runQueryParsed<T>(options: GraphQLQueryOptions): Promise<T> {
    const result = await this.runQuery(options);
    const parsedResult = this.parseResult(result);
    return parsedResult as T;
  }

  protected async runMutation(options: GraphQLQueryOptions) {
    if (!this.apiClient) {
      throw new Error('Merchant API Client is not set');
    }
    return this.apiClient.runMutation(options);
  }

  protected parseResult(result: any): any {
    return result;
  }

  protected cleanObject<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => v != null),
    ) as Partial<T>;
  }
}
