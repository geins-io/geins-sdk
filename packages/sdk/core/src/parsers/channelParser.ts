import type {
  GeinsChannelTypeType,
  GeinsCountryTypeType,
  GeinsCurrencyTypeType,
  GeinsLanguageTypeType,
  GeinsMarketTypeType,
} from '@geins/types';
import { GeinsError, GeinsErrorCode } from '../errors/geinsError';
import { sdkLogger } from '../utils/logger';

/**
 * Parses a GraphQL response containing multiple channels.
 * @param result - Raw GraphQL result with channels array.
 * @returns Parsed channel array, or undefined if no channels found.
 * @throws {GeinsError} PARSE_ERROR if result structure is invalid.
 */
export function parseChannelsResult(result: {
  data?: { channels?: GeinsChannelTypeType[] };
}): GeinsChannelTypeType[] | undefined {
  if (!result || !result.data) {
    throw new GeinsError('Invalid result structure for channels', GeinsErrorCode.PARSE_ERROR);
  }
  const channels = result.data.channels;
  if (!channels || channels.length === 0) {
    sdkLogger.warn('No channel found');
    return undefined;
  }
  return channels.map((channel) => parseChannel(channel)).filter(
    (ch): ch is GeinsChannelTypeType => ch !== undefined,
  );
}

/**
 * Parses a GraphQL response containing a single channel.
 * @param result - Raw GraphQL result with channel object.
 * @returns Parsed channel, or undefined if not found.
 * @throws {GeinsError} PARSE_ERROR if result structure is invalid.
 */
export function parseChannelResult(result: {
  data?: { channel?: GeinsChannelTypeType };
}): GeinsChannelTypeType | undefined {
  if (!result || !result.data) {
    throw new GeinsError('Invalid result structure for channel', GeinsErrorCode.PARSE_ERROR);
  }
  const channel = result.data.channel;
  if (!channel) {
    sdkLogger.warn('No channel found');
    return undefined;
  }
  return parseChannel(channel);
}
/**
 * Parses a single channel, including its markets and languages.
 * @param channel - Raw channel data.
 * @returns Parsed channel with nested markets/languages, or undefined.
 * @throws {GeinsError} PARSE_ERROR if channel or channel.id is missing.
 */
export function parseChannel(channel: GeinsChannelTypeType): GeinsChannelTypeType | undefined {
  if (!channel || !channel.id) {
    throw new GeinsError('Invalid result structure for channel', GeinsErrorCode.PARSE_ERROR);
  }

  return {
    id: channel.id,
    name: channel.name,
    type: channel.type,
    url: channel.url,
    defaultMarketId: channel.defaultMarketId,
    defaultLanguageId: channel.defaultLanguageId,
    markets: channel.markets
      ? channel.markets.filter((item): item is GeinsMarketTypeType => item != null).map((item) => parseMarket(item))
      : [],
    languages: channel.languages
      ? channel.languages.filter((item): item is GeinsLanguageTypeType => item != null).map((item) => parseLanguage(item))
      : [],
  };
}

/**
 * Parses a market with its languages, country, and currency.
 * Falls back to empty defaults for missing country/currency.
 */
export function parseMarket(market: GeinsMarketTypeType): GeinsMarketTypeType {
  return {
    id: market.id,
    alias: market.alias,
    allowedLanguages: market.allowedLanguages
      ? market.allowedLanguages.filter((item): item is GeinsLanguageTypeType => item != null).map((item) => parseLanguage(item))
      : [],
    country: market.country ? parseCountry(market.country) : { name: '', code: '' },
    currency: market.currency ? parseCurrency(market.currency) : { code: '', symbol: '', name: '', rate: 0 },
    onlyDisplayInCheckout: market.onlyDisplayInCheckout,
    virtual: market.virtual,
    groupKey: market.groupKey,
    defaultLanguageId: market.defaultLanguageId,
  };
}

/** Extracts name and code from a country object. */
export function parseCountry(country: GeinsCountryTypeType): GeinsCountryTypeType {
  return {
    name: country.name,
    code: country.code,
  };
}

/** Extracts id, name, and code from a language object. */
export function parseLanguage(language: GeinsLanguageTypeType): GeinsLanguageTypeType {
  return {
    id: language.id,
    name: language.name,
    code: language.code,
  };
}

/** Extracts code, symbol, name, and rate from a currency object. */
export function parseCurrency(currency: GeinsCurrencyTypeType): GeinsCurrencyTypeType {
  return {
    code: currency.code,
    symbol: currency.symbol,
    name: currency.name,
    rate: currency.rate,
  };
}
