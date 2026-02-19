import type { GeinsImageType } from '@geins/types';
import { GEINS_IMAGE_FOLDER } from '../constants/image';

/**
 * Builds a Geins CDN image URL for a specific folder.
 * @param imageBaseUrl - The resolved image endpoint (e.g. `https://monitor.commerce.services`).
 * @param type - The image content type.
 * @param folder - The CDN folder (e.g. `raw`, `100x100`).
 * @param fileName - The raw file name from the GraphQL API.
 * @returns The full CDN URL, or `''` if inputs are missing.
 * @example
 * ```ts
 * const url = buildGeinsImageUrl(
 *   'https://monitor.commerce.services',
 *   'product',
 *   'raw',
 *   'shoe.jpg',
 * );
 * // => 'https://monitor.commerce.services/product/raw/shoe.jpg'
 * ```
 */
export function buildGeinsImageUrl(
  imageBaseUrl: string,
  type: GeinsImageType,
  folder: string,
  fileName: string,
): string {
  if (!imageBaseUrl || !fileName) return '';
  return `${imageBaseUrl}/${type}/${folder}/${encodeURIComponent(fileName)}`;
}

/**
 * Builds a Geins CDN URL for the raw (original) image.
 * @param imageBaseUrl - The resolved image endpoint.
 * @param type - The image content type.
 * @param fileName - The raw file name from the GraphQL API.
 * @returns The full CDN URL for the original image.
 * @example
 * ```ts
 * const url = buildGeinsRawUrl(
 *   'https://monitor.commerce.services',
 *   'product',
 *   'shoe.jpg',
 * );
 * // => 'https://monitor.commerce.services/product/raw/shoe.jpg'
 * ```
 */
export function buildGeinsRawUrl(
  imageBaseUrl: string,
  type: GeinsImageType,
  fileName: string,
): string {
  return buildGeinsImageUrl(imageBaseUrl, type, GEINS_IMAGE_FOLDER.RAW, fileName);
}

/**
 * Builds a Geins CDN URL for the 100×100 thumbnail.
 * @param imageBaseUrl - The resolved image endpoint.
 * @param type - The image content type.
 * @param fileName - The raw file name from the GraphQL API.
 * @returns The full CDN URL for the thumbnail.
 * @example
 * ```ts
 * const url = buildGeinsThumbnailUrl(
 *   'https://monitor.commerce.services',
 *   'product',
 *   'shoe.jpg',
 * );
 * // => 'https://monitor.commerce.services/product/100x100/shoe.jpg'
 * ```
 */
export function buildGeinsThumbnailUrl(
  imageBaseUrl: string,
  type: GeinsImageType,
  fileName: string,
): string {
  return buildGeinsImageUrl(imageBaseUrl, type, GEINS_IMAGE_FOLDER.THUMB, fileName);
}
