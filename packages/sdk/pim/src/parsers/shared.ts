import type { AlternativeUrlType } from '@geins/types';

export function parseAlternativeUrls(data: any): AlternativeUrlType[] {
  if (!data) {
    return [];
  }
  return data.map(parseAlternativeUrl);
}

export function parseAlternativeUrl(data: any): AlternativeUrlType {
  const alternativeUrl: AlternativeUrlType = {
    url: data.url,
    culture: data.culture,
    language: data.language,
    country: data.country,
    channelId: data.channelId,
  };
  return alternativeUrl;
}
