import type { Channel, MarketLanguage } from '@geins/types';

export abstract class BaseApiService {
  protected client: any;
  protected channel: Channel;
  protected channelId: string;
  protected defaultMarketLanguage: MarketLanguage | undefined;

  constructor(
    client: any,
    channel: Channel,
    defaultMarketLanguage?: MarketLanguage,
  ) {
    this.client = client;

    if (!channel) {
      throw new Error('Channel is required');
    }

    if (defaultMarketLanguage) {
      this.defaultMarketLanguage = defaultMarketLanguage;
    }

    this.channelId = `${channel.siteId}|${channel.siteTopDomain}`;
    this.channel = channel;
  }

  protected createVariables(vars: any) {
    const variables = { ...vars };

    if (!variables.languageId) {
      if (!this.defaultMarketLanguage) {
        throw new Error('Language is required');
      }
      variables.languageId = this.defaultMarketLanguage.languageId;
    }

    if (!variables.marketId) {
      if (!this.defaultMarketLanguage) {
        throw new Error('Market is required');
      }
      variables.marketId = this.defaultMarketLanguage.marketId;
    }

    // make override possible
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
}
