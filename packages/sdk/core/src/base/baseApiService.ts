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

  destroy(): void {
    this._apiClient = undefined as any;
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
    const result = this.cleanObject(await this.runQuery(options));
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
    const cleanedObj = Object.entries(obj).reduce(
      (acc, [key, value]) => {
        // Skip __typename properties
        if (key.startsWith('__typename')) {
          return acc;
        }

        // Check if the value is an array, and clean each object inside it
        if (Array.isArray(value)) {
          acc[key] = value.map((item) => (item && typeof item === 'object' ? this.cleanObject(item) : item));
        }
        // Recursively clean if the value is a non-null object
        else if (value && typeof value === 'object') {
          acc[key] = this.cleanObject(value);
        }
        // Otherwise, keep the value as-is
        else {
          acc[key] = value;
        }

        return acc;
      },
      {} as Record<string, any>,
    );

    return cleanedObj as Partial<T>;
  }
}
