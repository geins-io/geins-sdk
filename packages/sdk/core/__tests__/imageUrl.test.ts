import { buildGeinsImageUrl, buildGeinsRawUrl, buildGeinsThumbnailUrl, GEINS_IMAGE_FOLDER } from '@geins/core';

const BASE = 'https://monitor.commerce.services';

describe('buildGeinsImageUrl', () => {
  it('should build a product image URL', () => {
    expect(buildGeinsImageUrl(BASE, 'product', 'raw', 'shoe.jpg')).toBe(
      'https://monitor.commerce.services/product/raw/shoe.jpg',
    );
  });

  it('should encode the fileName', () => {
    expect(buildGeinsImageUrl(BASE, 'product', 'raw', 'my shoe (1).jpg')).toBe(
      'https://monitor.commerce.services/product/raw/my%20shoe%20(1).jpg',
    );
  });

  it('should return empty string when imageBaseUrl is empty', () => {
    expect(buildGeinsImageUrl('', 'product', 'raw', 'shoe.jpg')).toBe('');
  });

  it('should return empty string when fileName is empty', () => {
    expect(buildGeinsImageUrl(BASE, 'product', 'raw', '')).toBe('');
  });

  it('should work for all image types', () => {
    for (const type of ['product', 'category', 'brand', 'cms'] as const) {
      const url = buildGeinsImageUrl(BASE, type, 'raw', 'img.jpg');
      expect(url).toBe(`https://monitor.commerce.services/${type}/raw/img.jpg`);
    }
  });

  it('should work with thumbnail folders', () => {
    expect(buildGeinsImageUrl(BASE, 'product', '100x100', 'shoe.jpg')).toBe(
      'https://monitor.commerce.services/product/100x100/shoe.jpg',
    );
    expect(buildGeinsImageUrl(BASE, 'product', '40x40', 'shoe.jpg')).toBe(
      'https://monitor.commerce.services/product/40x40/shoe.jpg',
    );
  });
});

describe('buildGeinsRawUrl', () => {
  it('should build a raw image URL', () => {
    expect(buildGeinsRawUrl(BASE, 'product', 'shoe.jpg')).toBe(
      'https://monitor.commerce.services/product/raw/shoe.jpg',
    );
  });

  it('should use the RAW folder constant', () => {
    const url = buildGeinsRawUrl(BASE, 'product', 'shoe.jpg');
    expect(url).toContain(`/${GEINS_IMAGE_FOLDER.RAW}/`);
  });

  it('should return empty string for missing inputs', () => {
    expect(buildGeinsRawUrl('', 'product', 'shoe.jpg')).toBe('');
    expect(buildGeinsRawUrl(BASE, 'product', '')).toBe('');
  });
});

describe('buildGeinsThumbnailUrl', () => {
  it('should build a thumbnail URL', () => {
    expect(buildGeinsThumbnailUrl(BASE, 'product', 'shoe.jpg')).toBe(
      'https://monitor.commerce.services/product/100x100/shoe.jpg',
    );
  });

  it('should use the THUMB folder constant', () => {
    const url = buildGeinsThumbnailUrl(BASE, 'product', 'shoe.jpg');
    expect(url).toContain(`/${GEINS_IMAGE_FOLDER.THUMB}/`);
  });

  it('should return empty string for missing inputs', () => {
    expect(buildGeinsThumbnailUrl('', 'product', 'shoe.jpg')).toBe('');
    expect(buildGeinsThumbnailUrl(BASE, 'product', '')).toBe('');
  });
});
