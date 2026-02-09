import {
  parseChannelsResult,
  parseChannelResult,
  parseChannel,
  parseMarket,
  parseCountry,
  parseLanguage,
  parseCurrency,
} from '../src/parsers/channelParser';
import { GeinsError, GeinsErrorCode } from '../src/errors/geinsError';

describe('channelParser', () => {
  describe('parseChannelsResult', () => {
    it('throws PARSE_ERROR when result is null', () => {
      expect(() => parseChannelsResult(null as any)).toThrow(GeinsError);
    });

    it('throws PARSE_ERROR when result.data is undefined', () => {
      expect(() => parseChannelsResult({} as any)).toThrow(GeinsError);
      expect(() => parseChannelsResult({ data: undefined } as any)).toThrow(GeinsError);
    });

    it('returns undefined when channels array is empty', () => {
      const result = parseChannelsResult({ data: { channels: [] } });
      expect(result).toBeUndefined();
    });

    it('returns undefined when channels is undefined', () => {
      const result = parseChannelsResult({ data: { channels: undefined } });
      expect(result).toBeUndefined();
    });

    it('parses valid channels', () => {
      const input = {
        data: {
          channels: [
            {
              id: 1,
              name: 'SE Channel',
              type: 'web',
              url: 'https://se.example.com',
              defaultMarketId: 1,
              defaultLanguageId: 'sv',
              markets: [],
              languages: [],
            },
          ],
        },
      };
      const result = parseChannelsResult(input as any);
      expect(result).toBeDefined();
      expect(result).toHaveLength(1);
      expect(result![0].name).toBe('SE Channel');
    });

    it('filters out undefined channels (invalid ones)', () => {
      const input = {
        data: {
          channels: [
            { id: 1, name: 'Valid', markets: [], languages: [] },
            { id: undefined, name: 'Invalid' }, // will throw inside parseChannel
          ],
        },
      };
      // parseChannel throws for invalid channel, but parseChannelsResult
      // doesn't catch — so this should throw
      expect(() => parseChannelsResult(input as any)).toThrow(GeinsError);
    });
  });

  describe('parseChannelResult', () => {
    it('throws PARSE_ERROR when result is null', () => {
      expect(() => parseChannelResult(null as any)).toThrow(GeinsError);
    });

    it('throws PARSE_ERROR when result.data is missing', () => {
      expect(() => parseChannelResult({} as any)).toThrow(GeinsError);
    });

    it('returns undefined when channel is undefined', () => {
      const result = parseChannelResult({ data: { channel: undefined } });
      expect(result).toBeUndefined();
    });

    it('parses a valid channel', () => {
      const input = {
        data: {
          channel: {
            id: 1,
            name: 'Test Channel',
            type: 'web',
            url: 'https://test.com',
            defaultMarketId: 1,
            defaultLanguageId: 'en',
            markets: [],
            languages: [],
          },
        },
      };
      const result = parseChannelResult(input as any);
      expect(result).toBeDefined();
      expect(result!.name).toBe('Test Channel');
      expect(result!.id).toBe(1);
    });
  });

  describe('parseChannel', () => {
    it('throws PARSE_ERROR when channel is null', () => {
      expect(() => parseChannel(null as any)).toThrow(GeinsError);
    });

    it('throws PARSE_ERROR when channel has no id', () => {
      expect(() => parseChannel({ name: 'No ID' } as any)).toThrow(GeinsError);
    });

    it('parses channel with markets and languages', () => {
      const input = {
        id: 1,
        name: 'Full Channel',
        type: 'web',
        url: 'https://full.com',
        defaultMarketId: 1,
        defaultLanguageId: 'en',
        markets: [
          {
            id: 1,
            alias: 'se',
            allowedLanguages: [{ id: 'sv', name: 'Swedish', code: 'sv' }],
            country: { name: 'Sweden', code: 'SE' },
            currency: { code: 'SEK', symbol: 'kr', name: 'Krona', rate: 1 },
          },
        ],
        languages: [{ id: 'en', name: 'English', code: 'en' }],
      };
      const result = parseChannel(input as any);
      expect(result).toBeDefined();
      expect(result!.markets).toHaveLength(1);
      expect(result!.markets![0]?.country?.name).toBe('Sweden');
      expect(result!.languages).toHaveLength(1);
    });

    it('handles null items in markets/languages arrays', () => {
      const input = {
        id: 1,
        name: 'With Nulls',
        markets: [null, { id: 1, alias: 'se', country: { name: 'Sweden', code: 'SE' }, currency: { code: 'SEK', symbol: 'kr', name: 'Krona', rate: 1 } }],
        languages: [null, { id: 'en', name: 'English', code: 'en' }],
      };
      const result = parseChannel(input as any);
      expect(result!.markets).toHaveLength(1);
      expect(result!.languages).toHaveLength(1);
    });

    it('defaults markets and languages to empty array when undefined', () => {
      const input = {
        id: 1,
        name: 'Minimal',
        markets: undefined,
        languages: undefined,
      };
      const result = parseChannel(input as any);
      expect(result!.markets).toEqual([]);
      expect(result!.languages).toEqual([]);
    });
  });

  describe('parseMarket', () => {
    it('parses market with all fields', () => {
      const input = {
        id: 1,
        alias: 'se',
        allowedLanguages: [{ id: 'sv', name: 'Swedish', code: 'sv' }],
        country: { name: 'Sweden', code: 'SE' },
        currency: { code: 'SEK', symbol: 'kr', name: 'Krona', rate: 1 },
        onlyDisplayInCheckout: false,
        virtual: false,
        groupKey: 'nordic',
        defaultLanguageId: 'sv',
      };
      const result = parseMarket(input as any);
      expect(result.id).toBe(1);
      expect(result.alias).toBe('se');
      expect(result.country?.name).toBe('Sweden');
      expect(result.currency?.code).toBe('SEK');
    });

    it('uses fallback for missing country', () => {
      const input = {
        id: 1,
        alias: 'se',
        country: undefined,
        currency: { code: 'SEK', symbol: 'kr', name: 'Krona', rate: 1 },
      };
      const result = parseMarket(input as any);
      expect(result.country).toEqual({ name: '', code: '' });
    });

    it('uses fallback for missing currency', () => {
      const input = {
        id: 1,
        alias: 'se',
        country: { name: 'Sweden', code: 'SE' },
        currency: undefined,
      };
      const result = parseMarket(input as any);
      expect(result.currency).toEqual({ code: '', symbol: '', name: '', rate: 0 });
    });

    it('handles null items in allowedLanguages', () => {
      const input = {
        id: 1,
        allowedLanguages: [null, { id: 'en', name: 'English', code: 'en' }],
        country: { name: 'X', code: 'XX' },
        currency: { code: 'USD', symbol: '$', name: 'Dollar', rate: 1 },
      };
      const result = parseMarket(input as any);
      expect(result.allowedLanguages).toHaveLength(1);
    });
  });

  describe('parseCountry', () => {
    it('returns name and code', () => {
      expect(parseCountry({ name: 'Sweden', code: 'SE' })).toEqual({ name: 'Sweden', code: 'SE' });
    });

    it('handles undefined fields', () => {
      const result = parseCountry({} as any);
      expect(result.name).toBeUndefined();
      expect(result.code).toBeUndefined();
    });
  });

  describe('parseLanguage', () => {
    it('returns id, name, code', () => {
      expect(parseLanguage({ id: 'sv', name: 'Swedish', code: 'sv' })).toEqual({
        id: 'sv',
        name: 'Swedish',
        code: 'sv',
      });
    });
  });

  describe('parseCurrency', () => {
    it('returns code, symbol, name, rate', () => {
      expect(parseCurrency({ code: 'SEK', symbol: 'kr', name: 'Krona', rate: 1 })).toEqual({
        code: 'SEK',
        symbol: 'kr',
        name: 'Krona',
        rate: 1,
      });
    });

    it('handles missing fields', () => {
      const result = parseCurrency({} as any);
      expect(result.code).toBeUndefined();
      expect(result.rate).toBeUndefined();
    });
  });
});
