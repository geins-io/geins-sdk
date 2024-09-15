import type {
  ChannelType,
  MarketType,
  CountryType,
  LanguageType,
  CurrencyType,
} from '@geins/types';

export function parseChannels(result: any): ChannelType[] | null {
  if (!result || !result.data) {
    throw new Error('Invalid result structure for channel');
  }
  const channels = result.data.channels;
  if (!channels || channels.length === 0) {
    console.warn('No channel found');
    return null;
  }
  return channels.map((channel: any) => parseChannel(channel));
}

export function parseChannel(result: any): ChannelType | null {
  if (!result || !result.data) {
    throw new Error('Invalid result structure for channel');
  }
  const channel = result.data.channel;
  if (!channel) {
    console.warn('No channel found');
    return null;
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

export function parseMarket(market: any): MarketType {
  return {
    id: market.id,
    alias: market.alias,
    allowedLanguages: market.allowedLanguages.map((item: any) =>
      parseLanguage(item),
    ),
    country: parseCountry(market.country),
    currency: parseCurrency(market.currency),
    onlyDisplayInCheckout: market.onlyDisplayInCheckout,
    virtual: market.virtual,
    groupKey: market.groupKey,
  };
}

export function parseCountry(country: any): CountryType {
  return {
    name: country.name,
    code: country.code,
  };
}

export function parseLanguage(language: any): LanguageType {
  return {
    id: language.id,
    name: language.name,
    code: language.code,
  };
}

export function parseCurrency(currency: any): CurrencyType {
  return {
    code: currency.code,
    symbol: currency.symbol,
  };
}
