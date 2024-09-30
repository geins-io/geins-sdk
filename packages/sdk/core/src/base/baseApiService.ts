import type { GeinsSettings } from '@geins/types';
import { FetchPolicyOptions } from '../api-client';

export abstract class BaseApiService {
  protected client: any;
  protected geinsSettings: GeinsSettings;
  protected channelId: string;

  constructor(client: any, geinsSettings: GeinsSettings) {
    this.client = client;

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

  protected async runQuery(query: any, variables: any) {
    if (!this.client) {
      throw new Error('Merchant API Client is not set');
    }
    return this.client.runQuery(query, variables);
  }

  protected async runQueryParsed<T>(query: any, variables: any): Promise<T> {
    const result = await this.runQuery(query, variables);

    // Assuming result is JSON. If not, adjust parsing accordingly.
    const parsedResult = this.parseResult(result);

    return parsedResult as T;
  }

  protected async runMutation(
    query: any,
    variables: any,
    userToken?: string | undefined,
  ) {
    if (!this.client) {
      throw new Error('Merchant API Client is not set');
    }
    return this.client.runMutation(
      query,
      variables,
      FetchPolicyOptions.NETWORK_ONLY,
      userToken,
    );
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
