import { AlternativeUrlType } from './shared';

export type BrandsQueryVariables = {
  marketId?: string;
  languageId?: string;
  channelId?: string;
};

export type BrandType = {
  brandId: number;
  alias?: string;
  slug?: string;
  name: string;
  description?: string;
  secondaryDescription?: string;
  primaryImage?: string;
  backgroundImage?: string;
  logo?: string;
  canonicalUrl: string;
  alternativeUrls?: AlternativeUrlType[];
};
