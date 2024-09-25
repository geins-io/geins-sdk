import { GeinsAlternativeUrlTypeType } from '../generated';

export type BrandsQueryVariables = {
  marketId?: string;
  languageId?: string;
  channelId?: string;
};

export interface GeinsBrandType {
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
  alternativeUrls?: GeinsAlternativeUrlTypeType[];
}
