import type { GeinsAlternativeUrlTypeType } from '@geins/types';

export function parseAlternativeUrls(data: any): GeinsAlternativeUrlTypeType[] {
  if (!data) {
    return [];
  }
  return data.map(parseAlternativeUrl);
}

export function parseAlternativeUrl(data: any): GeinsAlternativeUrlTypeType {
  const alternativeUrl: GeinsAlternativeUrlTypeType = {
    url: data.url,
    culture: data.culture,
    language: data.language,
    country: data.country,
    channelId: data.channelId,
  };
  return alternativeUrl;
}
