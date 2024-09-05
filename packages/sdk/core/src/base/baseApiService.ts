import type { GeinsCredentials } from '@geins/types';

export abstract class BaseApiService {
  protected client: any;
  protected geinsCredentials: GeinsCredentials;
  protected channelId: string;

  constructor(
    client: any,
    credentials: GeinsCredentials,
  ) {
    this.client = client;

    if (!credentials.channel) {
      throw new Error('Channel is required');
    }

    this.geinsCredentials = credentials;

    this.channelId = `${credentials.channel}|${credentials.tld}`;
  }

  protected createVariables(vars: any) {
    const variables = { ...vars };

    if (!variables.languageId) {
      if (!this.geinsCredentials.locale) {
        throw new Error('Language is required');
      }
      variables.languageId = this.geinsCredentials.locale;
    }

    if (!variables.marketId) {
      if (!this.geinsCredentials.market) {
        throw new Error('Market is required');
      }
      variables.marketId = this.geinsCredentials.market;
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

  protected abstract parseResult(result: any): any;
}
