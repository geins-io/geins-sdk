import type { GeinsSettings } from '@geins/types';
import { GraphQLQueryOptions } from '../api-client/merchantApiClient';

export abstract class BaseApiService {
  protected _apiClient: any;
  protected _geinsSettings: GeinsSettings;
  protected _channelId: string;

  constructor(apiClient: any, geinsSettings: GeinsSettings) {
    this._apiClient = apiClient;

    if (!geinsSettings.channel) {
      throw new Error('Channel is required');
    }

    this._geinsSettings = geinsSettings;
    this._channelId = `${geinsSettings.channel}|${geinsSettings.tld}`;
  }

  protected createVariables(vars: any) {
    const variables = { ...vars };

    if (!variables.languageId) {
      if (!this._geinsSettings.locale) {
        throw new Error('Language is required');
      }
      variables.languageId = this._geinsSettings.locale;
    }

    if (!variables.marketId) {
      if (!this._geinsSettings.market) {
        throw new Error('Market is required');
      }
      variables.marketId = this._geinsSettings.market;
    }

    if (!variables.channelId) {
      variables.channelId = this._channelId;
    }

    return variables;
  }

  protected async runQuery(options: GraphQLQueryOptions) {
    if (!this._apiClient) {
      throw new Error('Merchant API Client is not set');
    }
    return this._apiClient().runQuery(options);
  }

  protected async runQueryParsed<T>(options: GraphQLQueryOptions): Promise<T> {
    const result = await this.runQuery(options);
    const parsedResult = this.parseResult(result);
    return parsedResult as T;
  }

  protected async runMutation(options: GraphQLQueryOptions) {
    if (!this._apiClient) {
      throw new Error('Merchant API Client is not set');
    }
    return this._apiClient().runMutation(options);
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
