import {
  parseCheckoutSummary,
  parseCheckoutSummaryOrder,
  parseCheckoutSummaryOrderTotal,
  parseCheckoutSummaryOrderRows,
  parseCheckoutSummaryOrderRow,
  parseCheckout,
  parseValidateOrder,
  parseValidateOrderConditions,
} from '../src/parsers/checkoutParser';

describe('checkoutParser', () => {
  describe('parseCheckoutSummary', () => {
    it('returns undefined when no CheckoutDataType found', () => {
      expect(parseCheckoutSummary(undefined, 'en')).toBeUndefined();
      expect(parseCheckoutSummary(null, 'en')).toBeUndefined();
      expect(parseCheckoutSummary({}, 'en')).toBeUndefined();
    });

    it('parses a valid checkout summary', () => {
      const input = {
        __typename: 'CheckoutDataType',
        htmlSnippet: '<div>snippet</div>',
        order: null,
        nthPurchase: 3,
      };
      const result = parseCheckoutSummary(input, 'en');
      expect(result).toBeDefined();
      expect(result!.htmlSnippet).toBe('<div>snippet</div>');
      expect(result!.nthPurchase).toBe(3);
      expect(result!.order).toBeUndefined();
    });

    it('handles null htmlSnippet', () => {
      const input = {
        __typename: 'CheckoutDataType',
        htmlSnippet: null,
        order: null,
        nthPurchase: 1,
      };
      const result = parseCheckoutSummary(input, 'en');
      expect(result!.htmlSnippet).toBeUndefined();
    });
  });

  describe('parseCheckoutSummaryOrder', () => {
    it('returns undefined when no CheckoutOrderType found', () => {
      expect(parseCheckoutSummaryOrder(null, 'en')).toBeUndefined();
      expect(parseCheckoutSummaryOrder(undefined, 'en')).toBeUndefined();
    });

    it('parses order with addresses and campaigns', () => {
      const input = {
        __typename: 'CheckoutOrderType',
        status: 'completed',
        orderId: 'ORD-123',
        transactionId: 'TX-456',
        marketId: 1,
        languageId: 'sv',
        customerId: 42,
        customerTypeId: 1,
        customerGroupId: 2,
        paymentId: 10,
        shippingId: 20,
        promoCode: 'SAVE10',
        campaignIds: ['c1', null, 'c2'],
        campaignNames: ['Campaign 1', null],
        currency: 'SEK',
        rows: [],
        billingAddress: {
          __typename: 'AddressType',
          firstName: 'John',
          city: 'Stockholm',
        },
        shippingAddress: null,
      };
      const result = parseCheckoutSummaryOrder(input as any, 'sv-SE');
      expect(result).toBeDefined();
      expect(result!.status).toBe('completed');
      expect(result!.orderId).toBe('ORD-123');
      expect(result!.promoCode).toBe('SAVE10');
      expect(result!.appliedCampaignIds).toEqual(['c1', 'c2']);
      expect(result!.appliedCampaigns).toEqual(['Campaign 1']);
      expect(result!.billingAddress?.firstName).toBe('John');
      expect(result!.shippingAddress).toBeUndefined();
    });
  });

  describe('parseCheckoutSummaryOrderTotal', () => {
    it('aggregates row discounts into total', () => {
      const input = {
        itemValueIncVat: 1000,
        itemValueExVat: 800,
        orderValueIncVat: 950,
        orderValueExVat: 760,
        paymentFeeIncVat: 25,
        paymentFeeExVat: 20,
        shippingFeeIncVat: 50,
        shippingFeeExVat: 40,
        discountIncVat: 10,
        discountExVat: 8,
        sum: 925,
        currency: 'SEK',
        rows: [
          { discountExVat: 5, discountIncVat: 6 },
          { discountExVat: 3, discountIncVat: 4 },
          null,
        ],
      };
      const result = parseCheckoutSummaryOrderTotal(input as any, 'sv-SE');
      expect(result).toBeDefined();
      // Base discount + row discounts
      expect(result!.discountExVat).toBe(8 + 5 + 3);
      expect(result!.discountIncVat).toBe(10 + 6 + 4);
    });

    it('uses base discounts when no rows', () => {
      const input = {
        discountIncVat: 50,
        discountExVat: 40,
        currency: 'SEK',
        rows: null,
      };
      const result = parseCheckoutSummaryOrderTotal(input as any, 'sv-SE');
      expect(result!.discountIncVat).toBe(50);
      expect(result!.discountExVat).toBe(40);
    });
  });

  describe('parseCheckoutSummaryOrderRows', () => {
    it('returns undefined for null data', () => {
      expect(parseCheckoutSummaryOrderRows(null, 'en')).toBeUndefined();
      expect(parseCheckoutSummaryOrderRows(undefined, 'en')).toBeUndefined();
    });

    it('parses simple rows', () => {
      const rows = [
        {
          __typename: 'CheckoutOrderRowType',
          quantity: 2,
          sku: 'SKU-1',
          articleNumber: 'ART-1',
          name: 'Product A',
          currency: 'SEK',
          priceIncVat: 200,
          priceExVat: 160,
        },
      ];
      const result = parseCheckoutSummaryOrderRows(rows as any, 'sv-SE');
      expect(result).toHaveLength(1);
      expect(result![0].quantity).toBe(2);
      expect(result![0].skuId).toBe('SKU-1');
    });

    it('combines duplicate rows by key', () => {
      const rows = [
        {
          __typename: 'CheckoutOrderRowType',
          quantity: 1,
          sku: 'SKU-1',
          articleNumber: 'ART-1',
          currency: 'SEK',
          priceIncVat: 100,
          priceExVat: 80,
          discountIncVat: 5,
          discountExVat: 4,
          message: null,
        },
        {
          __typename: 'CheckoutOrderRowType',
          quantity: 2,
          sku: 'SKU-1',
          articleNumber: 'ART-1',
          currency: 'SEK',
          priceIncVat: 200,
          priceExVat: 160,
          discountIncVat: 10,
          discountExVat: 8,
          message: null,
        },
      ];
      const result = parseCheckoutSummaryOrderRows(rows as any, 'sv-SE');
      expect(result).toHaveLength(1);
      expect(result![0].quantity).toBe(3); // 1 + 2
      expect(result![0].price?.priceIncVat).toBe(300); // 100 + 200
      expect(result![0].price?.discountIncVat).toBe(15); // 5 + 10
    });

    it('keeps rows with different keys separate', () => {
      const rows = [
        {
          __typename: 'CheckoutOrderRowType',
          quantity: 1,
          sku: 'SKU-1',
          articleNumber: 'ART-1',
          currency: 'SEK',
          priceIncVat: 100,
        },
        {
          __typename: 'CheckoutOrderRowType',
          quantity: 1,
          sku: 'SKU-2',
          articleNumber: 'ART-2',
          currency: 'SEK',
          priceIncVat: 200,
        },
      ];
      const result = parseCheckoutSummaryOrderRows(rows as any, 'sv-SE');
      expect(result).toHaveLength(2);
    });

    it('filters out null rows', () => {
      const rows = [
        null,
        {
          __typename: 'CheckoutOrderRowType',
          quantity: 1,
          sku: 'SKU-1',
          currency: 'SEK',
        },
      ];
      const result = parseCheckoutSummaryOrderRows(rows as any, 'en');
      expect(result).toHaveLength(1);
    });
  });

  describe('parseCheckoutSummaryOrderRow', () => {
    it('returns undefined for null data', () => {
      expect(parseCheckoutSummaryOrderRow(null, 'en')).toBeUndefined();
    });

    it('returns undefined for data without __typename', () => {
      expect(parseCheckoutSummaryOrderRow({ quantity: 1 } as any, 'en')).toBeUndefined();
    });

    it('parses a full row', () => {
      const input = {
        __typename: 'CheckoutOrderRowType',
        quantity: 3,
        sku: 'SKU-42',
        articleNumber: 'ART-42',
        gtin: '1234567890',
        variant: 'Size L',
        weight: 0.5,
        height: 10,
        length: 20,
        width: 15,
        message: 'Gift',
        name: 'Cool T-Shirt',
        brand: 'BrandX',
        imageUrl: 'https://img.com/shirt.jpg',
        categories: ['Shirts', null, 'Apparel'],
        productId: 100,
        productUrl: '/cool-t-shirt',
        currency: 'SEK',
        priceIncVat: 300,
        priceExVat: 240,
        discountIncVat: 30,
        discountExVat: 24,
        discountRate: 10,
        campaignIds: ['c1'],
        campaignNames: ['Summer Sale'],
      };
      const result = parseCheckoutSummaryOrderRow(input as any, 'sv-SE');
      expect(result).toBeDefined();
      expect(result!.quantity).toBe(3);
      expect(result!.skuId).toBe('SKU-42');
      expect(result!.name).toBe('Size L');
      expect(result!.product?.name).toBe('Cool T-Shirt');
      expect(result!.product?.categories).toEqual(['Shirts', 'Apparel']);
      expect(result!.price?.discountRate).toBe(10);
      expect(result!.price?.campaignIds).toEqual(['c1']);
    });
  });

  describe('parseCheckout', () => {
    it('returns undefined when no CheckoutType found', () => {
      expect(parseCheckout(undefined, 'en')).toBeUndefined();
      expect(parseCheckout({}, 'en')).toBeUndefined();
    });

    it('parses a valid checkout', () => {
      const input = {
        __typename: 'CheckoutType',
        email: 'test@example.com',
        identityNumber: '12345',
        cart: {
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
        },
        paymentOptions: [],
        shippingOptions: [],
        billingAddress: {
          __typename: 'AddressType',
          firstName: 'John',
        },
        shippingAddress: null,
      };
      const result = parseCheckout(input as any, 'en');
      expect(result).toBeDefined();
      expect(result!.email).toBe('test@example.com');
      expect(result!.cart).toBeDefined();
      expect(result!.cart!.id).toBe('cart-1');
      expect(result!.billingAddress?.firstName).toBe('John');
    });
  });

  describe('parseValidateOrder', () => {
    it('returns undefined when no ValidateOrderCreationResponseType found', () => {
      expect(parseValidateOrder(undefined)).toBeUndefined();
      expect(parseValidateOrder({})).toBeUndefined();
    });

    it('parses valid validation response', () => {
      const input = {
        __typename: 'ValidateOrderCreationResponseType',
        isValid: true,
        message: 'OK',
        memberType: 'premium',
      };
      const result = parseValidateOrder(input);
      expect(result).toBeDefined();
      expect(result!.isValid).toBe(true);
      expect(result!.message).toBe('OK');
      expect(result!.customerGroup).toBe('premium');
    });

    it('handles null message and memberType', () => {
      const input = {
        __typename: 'ValidateOrderCreationResponseType',
        isValid: false,
        message: null,
        memberType: null,
      };
      const result = parseValidateOrder(input);
      expect(result!.isValid).toBe(false);
      expect(result!.message).toBeUndefined();
      expect(result!.customerGroup).toBeUndefined();
    });
  });

  describe('parseValidateOrderConditions', () => {
    it('returns undefined when not found', () => {
      expect(parseValidateOrderConditions(undefined)).toBeUndefined();
    });

    it('parses conditions with default empty message', () => {
      const input = {
        __typename: 'ValidateOrderCreationResponseType',
        isValid: true,
        message: null,
      };
      const result = parseValidateOrderConditions(input);
      expect(result!.isValid).toBe(true);
      expect(result!.message).toBe('');
    });
  });
});
