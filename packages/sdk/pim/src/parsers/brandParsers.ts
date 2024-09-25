import type { GeinsBrandType } from '@geins/types';
import { parseAlternativeUrls } from './shared';

export function parseBrands(data: any): GeinsBrandType[] {
  return data.map(parseBrand);
}

export function parseBrand(data: any): GeinsBrandType {
  const brand: GeinsBrandType = {
    brandId: data.brandId,
    alias: data.alias,
    slug: data.slug,
    name: data.name,
    description: data.description,
    secondaryDescription: data.secondaryDescription,
    primaryImage: data.primaryImage,
    backgroundImage: data.backgroundImage,
    logo: data.logo,
    canonicalUrl: data.canonicalUrl,
    alternativeUrls: parseAlternativeUrls(data.alternativeUrls),
  };
  return brand;
}
