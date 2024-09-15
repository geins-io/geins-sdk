// import { AlternativeUrlType, MetadataType } from '../common';

type PageInfoType = {
  id: number;
  alias: string;
  canonicalUrl?: string;
  alternativeCanonicalUrls?: string[];
  alternativeUrls?: AlternativeUrlType[];
  backgroundImage?: string;
  logo?: string;
  name: string;
  hideTitle: boolean;
  hideDescription: boolean;
  primaryDescription?: string;
  primaryImage?: string;
  secondaryDescription?: string;
  meta?: MetadataType;
  // subCategories?: CategoryType[];
};

export type BrandType = {
  brandId: number;
  alias?: string;
  name: string;
  description?: string;
  secondaryDescription?: string;
  primaryImage?: string;
  backgroundImage?: string;
  logo?: string;
  canonicalUrl: string;
  alternativeUrls?: AlternativeUrlType[];
};

export type AlternativeUrlType = {
  url: string;
  culture: string;
  language: string;
  country?: string;
  channelId: string;
};

export type MetadataType = {
  title: string;
  description?: string;
  keywords?: string;
};
