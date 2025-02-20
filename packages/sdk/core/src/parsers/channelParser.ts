import type {
  GeinsChannelTypeType,
  GeinsCountryTypeType,
  GeinsCurrencyTypeType,
  GeinsLanguageTypeType,
  GeinsMarketTypeType,
} from '@geins/types';

export function parseChannelsResult(result: any): GeinsChannelTypeType[] | undefined {
  if (!result || !result.data) {
    throw new Error('Invalid result structure for channels');
  }
  const channels = result.data.channels;
  if (!channels || channels.length === 0) {
    console.warn('No channel found');
    return undefined;
  }
  return channels.map((channel: any) => parseChannel(channel));
}

export function parseChannelResult(result: any): GeinsChannelTypeType | undefined {
  if (!result || !result.data) {
    throw new Error('Invalid result structure for channel');
  }
  const channel = result.data.channel;
  if (!channel) {
    console.warn('No channel found');
    return undefined;
  }
  return parseChannel(channel);
}
export function parseChannel(channel: any): GeinsChannelTypeType | undefined {
  if (!channel || !channel.id) {
    throw new Error('Invalid result structure for channel');
  }

  return {
    id: channel.id,
    name: channel.name,
    type: channel.type,
    url: channel.url,
    defaultMarketId: channel.defaultMarketId,
    defaultLanguageId: channel.defaultLanguageId,
    markets: channel.markets.map((item: any) => parseMarket(item)),
    languages: channel.languages.map((item: any) => parseLanguage(item)),
  };
}

export function parseMarket(market: any): GeinsMarketTypeType {
  return {
    id: market.id,
    alias: market.alias,
    allowedLanguages: market.allowedLanguages.map((item: any) => parseLanguage(item)),
    country: parseCountry(market.country),
    currency: parseCurrency(market.currency),
    onlyDisplayInCheckout: market.onlyDisplayInCheckout,
    virtual: market.virtual,
    groupKey: market.groupKey,
    defaultLanguageId: market.defaultLanguageId,
  };
}

export function parseCountry(country: any): GeinsCountryTypeType {
  return {
    name: country.name,
    code: country.code,
  };
}

export function parseLanguage(language: any): GeinsLanguageTypeType {
  return {
    id: language.id,
    name: language.name,
    code: language.code,
  };
}

export function parseCurrency(currency: any): GeinsCurrencyTypeType {
  return {
    code: currency.code,
    symbol: currency.symbol,
    name: currency.name,
    rate: currency.rate,
  };
}
