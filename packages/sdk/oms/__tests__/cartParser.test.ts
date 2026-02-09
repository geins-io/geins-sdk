import { groupCartItems, parseCart } from '../src/parsers/cartParser';
import type { CartItemType, PriceType } from '@geins/types';

// --- Helpers ---

function mockPrice(overrides: Partial<PriceType> = {}): PriceType {
  return {
    sellingPriceIncVat: 0,
    sellingPriceExVat: 0,
    regularPriceIncVat: 0,
    regularPriceExVat: 0,
    discountIncVat: 0,
    discountExVat: 0,
    discountPercentage: 0,
    vat: 0,
    isDiscounted: false,
    sellingPriceIncVatFormatted: '',
    sellingPriceExVatFormatted: '',
    regularPriceIncVatFormatted: '',
    regularPriceExVatFormatted: '',
    discountIncVatFormatted: '',
    discountExVatFormatted: '',
    vatFormatted: '',
    currency: { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', rate: 1 },
    ...overrides,
  };
}

function mockCartItem(overrides: Partial<CartItemType> = {}): CartItemType {
  return {
    id: '1',
    title: 'Test Product',
    type: 'PRODUCT' as any,
    quantity: 1,
    totalPrice: mockPrice({ sellingPriceIncVat: 100 }),
    unitPrice: mockPrice({ sellingPriceIncVat: 100 }),
    product: {
      productId: '123',
      articleNumber: 'ART-001',
      brand: { name: 'TestBrand' },
      name: 'Test Product',
      productImages: [],
      alias: 'test-product',
      canonicalUrl: '/test-product',
      primaryCategory: { name: 'Shoes' },
      skus: [],
      unitPrice: mockPrice(),
    },
    ...overrides,
  } as CartItemType;
}

// --- Tests ---

describe('cartParser', () => {
  describe('parseCart', () => {
    it('returns undefined when no CartType __typename found', () => {
      expect(parseCart(undefined, 'en')).toBeUndefined();
      expect(parseCart(null, 'en')).toBeUndefined();
      expect(parseCart({}, 'en')).toBeUndefined();
      expect(parseCart({ data: {} }, 'en')).toBeUndefined();
    });

    it('parses a minimal cart', () => {
      const input = {
        __typename: 'CartType',
        id: 'cart-1',
        items: [],
        isCompleted: false,
        promoCode: null,
        freeShipping: false,
        fixedDiscount: 0,
        merchantData: null,
        appliedCampaigns: null,
        summary: null,
      };
      const result = parseCart(input, 'en');
      expect(result).toBeDefined();
      expect(result!.id).toBe('cart-1');
      expect(result!.items).toEqual([]);
      expect(result!.completed).toBe(false);
      expect(result!.promoCode).toBeUndefined();
      expect(result!.freeShipping).toBe(false);
    });

    it('parses cart with items', () => {
      const input = {
        __typename: 'CartType',
        id: 'cart-2',
        items: [
          {
            id: 1,
            skuId: 42,
            quantity: 2,
            product: {
              productId: 100,
              articleNumber: 'ART-100',
              name: 'Cool Shoe',
              brand: { name: 'Nike' },
              productImages: [{ fileName: 'shoe.jpg' }],
              alias: 'cool-shoe',
              canonicalUrl: '/cool-shoe',
              primaryCategory: { name: 'Shoes' },
              skus: [],
              unitPrice: null,
            },
            totalPrice: {
              sellingPriceIncVat: 200,
              currency: { code: 'SEK', symbol: 'kr', name: 'Krona', rate: 1 },
            },
            unitPrice: {
              sellingPriceIncVat: 100,
              currency: { code: 'SEK', symbol: 'kr', name: 'Krona', rate: 1 },
            },
            productPackage: null,
            campaign: null,
            groupKey: null,
            message: null,
          },
        ],
        isCompleted: false,
        promoCode: 'SAVE10',
        freeShipping: true,
        fixedDiscount: 10,
        merchantData: '{"tracking":"abc"}',
        appliedCampaigns: [],
        summary: null,
      };
      const result = parseCart(input, 'sv-SE');
      expect(result).toBeDefined();
      expect(result!.items).toHaveLength(1);
      expect(result!.items[0].quantity).toBe(2);
      expect(result!.items[0].product?.name).toBe('Cool Shoe');
      expect(result!.items[0].product?.productId).toBe('100');
      expect(result!.promoCode).toBe('SAVE10');
      expect(result!.merchantData).toBe('{"tracking":"abc"}');
    });

    it('finds nested CartType via findObjectWithProperty', () => {
      const input = {
        data: {
          cart: {
            __typename: 'CartType',
            id: 'nested-cart',
            items: [],
            isCompleted: false,
            promoCode: null,
            freeShipping: false,
            fixedDiscount: 0,
            merchantData: null,
            appliedCampaigns: null,
            summary: null,
          },
        },
      };
      const result = parseCart(input, 'en');
      expect(result).toBeDefined();
      expect(result!.id).toBe('nested-cart');
    });

    it('handles null items in item array', () => {
      const input = {
        __typename: 'CartType',
        id: 'cart-nulls',
        items: [null, null],
        isCompleted: false,
        promoCode: null,
        freeShipping: false,
        fixedDiscount: 0,
        merchantData: null,
        appliedCampaigns: null,
        summary: null,
      };
      const result = parseCart(input, 'en');
      expect(result).toBeDefined();
      // null items are still mapped (with defaults), not filtered
      expect(result!.items).toHaveLength(2);
    });

    it('handles null items array', () => {
      const input = {
        __typename: 'CartType',
        id: 'cart-no-items',
        items: null,
        isCompleted: false,
        promoCode: null,
        freeShipping: false,
        fixedDiscount: 0,
        merchantData: null,
        appliedCampaigns: null,
        summary: null,
      };
      const result = parseCart(input, 'en');
      expect(result).toBeDefined();
      expect(result!.items).toEqual([]);
    });

    it('parses cart summary with all fields', () => {
      const input = {
        __typename: 'CartType',
        id: 'cart-summary',
        items: [],
        isCompleted: false,
        promoCode: null,
        freeShipping: false,
        fixedDiscount: 0,
        merchantData: null,
        appliedCampaigns: null,
        summary: {
          total: { sellingPriceIncVat: 500, currency: { code: 'SEK' } },
          subTotal: { sellingPriceIncVat: 400, currency: { code: 'SEK' } },
          vats: [{ rate: 25, amount: 100 }],
          fees: {
            paymentFeeIncVat: 10,
            paymentFeeExVat: 8,
            shippingFeeIncVat: 50,
            shippingFeeExVat: 40,
          },
          balance: {
            pending: 0,
            totalSellingPriceExBalanceExVat: 400,
            totalSellingPriceExBalanceIncVat: 500,
          },
          fixedAmountDiscountIncVat: 0,
          fixedAmountDiscountExVat: 0,
          shipping: {
            id: 1,
            amountLeftToFreeShipping: 200,
            feeIncVat: 50,
            feeExVat: 40,
            isDefault: true,
            isSelected: true,
          },
          payment: {
            id: 2,
            feeIncVat: 10,
            feeExVat: 8,
            isDefault: true,
            isSelected: false,
          },
        },
      };
      const result = parseCart(input, 'sv-SE');
      expect(result).toBeDefined();
      expect(result!.summary.total.sellingPriceIncVat).toBe(500);
      expect(result!.summary.vats).toHaveLength(1);
      expect(result!.summary.vats[0].rate).toBe(25);
      expect(result!.summary.fees.shippingFeeIncVat).toBe(50);
      expect(result!.summary.shipping.isDefault).toBe(true);
    });

    it('parses cart with product package item', () => {
      const input = {
        __typename: 'CartType',
        id: 'cart-pkg',
        items: [
          {
            id: 1,
            skuId: 10,
            quantity: 1,
            product: { productId: 1, name: 'Package Item', brand: null, productImages: [], skus: [] },
            totalPrice: null,
            unitPrice: null,
            productPackage: {
              packageId: 'pkg-1',
              packageName: 'Gift Set',
              groupId: 'g-1',
              optionId: 'o-1',
            },
            campaign: null,
            groupKey: '100',
            message: 'Gift message',
          },
        ],
        isCompleted: false,
        promoCode: null,
        freeShipping: false,
        fixedDiscount: 0,
        merchantData: null,
        appliedCampaigns: null,
        summary: null,
      };
      const result = parseCart(input, 'en');
      expect(result).toBeDefined();
      expect(result!.items[0].title).toBe('Gift Set');
      expect(result!.items[0].type).toBe('PACKAGE');
      expect(result!.items[0].productPackage?.packageId).toBe('pkg-1');
      expect(result!.items[0].groupKey).toBe('100');
      expect(result!.items[0].message).toBe('Gift message');
    });
  });

  describe('groupCartItems', () => {
    it('returns items without groupKey as-is', () => {
      const items = [
        mockCartItem({ id: '1', groupKey: undefined }),
        mockCartItem({ id: '2', groupKey: undefined }),
      ];
      const result = groupCartItems(items, 'en');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('2');
    });

    it('groups items with same groupKey', () => {
      const items = [
        mockCartItem({ id: '1', groupKey: 'group-a', totalPrice: mockPrice({ sellingPriceIncVat: 50 }) }),
        mockCartItem({ id: '2', groupKey: 'group-a', totalPrice: mockPrice({ sellingPriceIncVat: 75 }) }),
      ];
      const result = groupCartItems(items, 'en');
      expect(result).toHaveLength(1);
      expect(result[0].productPackageCartItems).toHaveLength(2);
      // Aggregated price
      expect(result[0].totalPrice?.sellingPriceIncVat).toBe(125);
    });

    it('keeps ungrouped and grouped items separate', () => {
      const items = [
        mockCartItem({ id: '1', groupKey: undefined }),
        mockCartItem({ id: '2', groupKey: 'group-a' }),
        mockCartItem({ id: '3', groupKey: 'group-a' }),
        mockCartItem({ id: '4', groupKey: undefined }),
      ];
      const result = groupCartItems(items, 'en');
      // 2 ungrouped + 1 grouped
      expect(result).toHaveLength(3);
    });

    it('removes product and skuId from grouped base item', () => {
      const items = [
        mockCartItem({ id: '1', groupKey: 'group-a', skuId: 42 }),
        mockCartItem({ id: '2', groupKey: 'group-a', skuId: 43 }),
      ];
      const result = groupCartItems(items, 'en');
      expect(result[0].product).toBeUndefined();
      expect(result[0].skuId).toBeUndefined();
    });

    it('handles empty array', () => {
      expect(groupCartItems([], 'en')).toEqual([]);
    });

    it('handles multiple groups', () => {
      const items = [
        mockCartItem({ id: '1', groupKey: 'group-a' }),
        mockCartItem({ id: '2', groupKey: 'group-b' }),
        mockCartItem({ id: '3', groupKey: 'group-a' }),
        mockCartItem({ id: '4', groupKey: 'group-b' }),
      ];
      const result = groupCartItems(items, 'en');
      expect(result).toHaveLength(2);
      expect(result[0].productPackageCartItems).toHaveLength(2);
      expect(result[1].productPackageCartItems).toHaveLength(2);
    });

    it('calculates aggregated discount correctly', () => {
      const items = [
        mockCartItem({
          id: '1',
          groupKey: 'group-a',
          totalPrice: mockPrice({ sellingPriceIncVat: 100, discountIncVat: 10, discountExVat: 8, vat: 20 }),
        }),
        mockCartItem({
          id: '2',
          groupKey: 'group-a',
          totalPrice: mockPrice({ sellingPriceIncVat: 200, discountIncVat: 30, discountExVat: 24, vat: 40 }),
        }),
      ];
      const result = groupCartItems(items, 'en');
      expect(result[0].totalPrice?.sellingPriceIncVat).toBe(300);
      expect(result[0].totalPrice?.discountIncVat).toBe(40);
      expect(result[0].totalPrice?.discountExVat).toBe(32);
      expect(result[0].totalPrice?.vat).toBe(60);
      expect(result[0].totalPrice?.isDiscounted).toBe(true);
    });

    it('sets isDiscounted false when no discount', () => {
      const items = [
        mockCartItem({
          id: '1',
          groupKey: 'group-a',
          totalPrice: mockPrice({ sellingPriceIncVat: 100, discountIncVat: 0 }),
        }),
      ];
      const result = groupCartItems(items, 'en');
      expect(result[0].totalPrice?.isDiscounted).toBe(false);
    });
  });
});
