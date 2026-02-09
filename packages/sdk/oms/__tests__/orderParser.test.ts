import {
  parseOrder,
  parseCheckoutOrderSummary,
  parseOrderSummary,
  parseRefunds,
  parseRefund,
  parseShippingDetails,
  parseShippingDetail,
  parsePaymentDetails,
  parsePaymentDetail,
} from '../src/parsers/orderParser';

describe('orderParser', () => {
  describe('parseOrder', () => {
    it('returns undefined when no PlaceOrderResponseType found', () => {
      expect(parseOrder(undefined, 'en')).toBeUndefined();
      expect(parseOrder(null, 'en')).toBeUndefined();
      expect(parseOrder({}, 'en')).toBeUndefined();
    });

    it('parses a placed order response', () => {
      const input = {
        __typename: 'PlaceOrderResponseType',
        orderId: 'ORD-1',
        publicId: 'PUB-1',
      };
      const result = parseOrder(input, 'en');
      expect(result).toBeDefined();
      expect(result!.created).toBe(true);
      expect(result!.orderId).toBe('ORD-1');
      expect(result!.publicId).toBe('PUB-1');
    });

    it('handles null orderId and publicId', () => {
      const input = {
        __typename: 'PlaceOrderResponseType',
        orderId: null,
        publicId: null,
      };
      const result = parseOrder(input, 'en');
      expect(result!.created).toBe(true);
      expect(result!.orderId).toBeUndefined();
      expect(result!.publicId).toBeUndefined();
    });
  });

  describe('parseCheckoutOrderSummary', () => {
    it('returns undefined when no CheckoutDataType found', () => {
      expect(parseCheckoutOrderSummary(undefined, 'en')).toBeUndefined();
      expect(parseCheckoutOrderSummary({}, 'en')).toBeUndefined();
    });

    it('parses checkout data with order', () => {
      const input = {
        __typename: 'CheckoutDataType',
        order: {
          orderId: 'ORD-42',
          customerId: 100,
          currency: 'SEK',
          status: 'completed',
          message: 'Thanks',
          billingAddress: {
            __typename: 'AddressType',
            firstName: 'Jane',
          },
          shippingAddress: null,
        },
        cart: null,
      };
      const result = parseCheckoutOrderSummary(input as any, 'sv-SE');
      expect(result).toBeDefined();
      expect(result!.id).toBe('ORD-42');
      expect(result!.customerId).toBe('100');
      expect(result!.currency).toBe('SEK');
      expect(result!.billingAddress?.firstName).toBe('Jane');
      // These are set to undefined in parseCheckoutOrderSummary
      expect(result!.paymentDetails).toBeUndefined();
      expect(result!.refunds).toBeUndefined();
    });

    it('handles missing order in checkout data', () => {
      const input = {
        __typename: 'CheckoutDataType',
        order: null,
        cart: null,
      };
      const result = parseCheckoutOrderSummary(input as any, 'en');
      expect(result).toBeDefined();
      expect(result!.id).toBeUndefined();
      expect(result!.customerId).toBeUndefined();
    });
  });

  describe('parseOrderSummary', () => {
    it('returns undefined when no OrderType found', () => {
      expect(parseOrderSummary(undefined, 'en')).toBeUndefined();
      expect(parseOrderSummary({}, 'en')).toBeUndefined();
    });

    it('parses a full order summary', () => {
      const input = {
        __typename: 'OrderType',
        id: 42,
        customerId: 100,
        createdAt: '2025-01-01',
        completedAt: '2025-01-02',
        currency: 'SEK',
        status: 'shipped',
        updatedAt: '2025-01-03',
        publicId: 'PUB-42',
        billingAddress: {
          __typename: 'AddressType',
          firstName: 'John',
        },
        shippingAddress: null,
        cart: null,
        paymentDetails: null,
        discount: null,
        orderTotal: null,
        paymentFee: null,
        shippingFee: null,
        vat: null,
        fromBalance: 50,
        fromBalanceFormatted: '50 kr',
        refunds: null,
        shippingDetails: null,
      };
      const result = parseOrderSummary(input as any, 'sv-SE');
      expect(result).toBeDefined();
      expect(result!.id).toBe('42');
      expect(result!.customerId).toBe('100');
      expect(result!.createdAt).toBe('2025-01-01');
      expect(result!.status).toBe('shipped');
      expect(result!.publicId).toBe('PUB-42');
      expect(result!.fromBalance).toBe(50);
    });
  });

  describe('parseRefunds', () => {
    it('returns undefined for non-array', () => {
      expect(parseRefunds(null)).toBeUndefined();
      expect(parseRefunds(undefined)).toBeUndefined();
      expect(parseRefunds('not array' as any)).toBeUndefined();
    });

    it('parses refund array', () => {
      const input = [
        {
          __typename: 'RefundType',
          id: 1,
          itemId: 10,
          articleNumber: 'ART-1',
          createdAt: '2025-01-15',
          reason: 'Defective',
          total: 100,
          vat: 25,
        },
      ];
      const result = parseRefunds(input as any);
      expect(result).toHaveLength(1);
      expect(result![0].reason).toBe('Defective');
    });

    it('filters out null/undefined entries', () => {
      const input = [null, undefined];
      const result = parseRefunds(input as any);
      expect(result).toEqual([]);
    });
  });

  describe('parseRefund', () => {
    it('returns undefined for null', () => {
      expect(parseRefund(null)).toBeUndefined();
    });

    it('returns undefined when no RefundType __typename', () => {
      expect(parseRefund({ id: 1 } as any)).toBeUndefined();
    });

    it('parses a valid refund', () => {
      const input = {
        __typename: 'RefundType',
        id: 5,
        itemId: 50,
        articleNumber: 'ART-X',
        createdAt: '2025-06-01',
        reason: 'Wrong size',
        reasonCode: 'SIZE',
        refundType: 'full',
        toBalance: false,
        total: 200,
        vat: 50,
      };
      const result = parseRefund(input as any);
      expect(result).toBeDefined();
      expect(result!.id).toBe(5);
      expect(result!.reason).toBe('Wrong size');
      expect(result!.total).toBe(200);
    });
  });

  describe('parseShippingDetails', () => {
    it('returns undefined for non-array', () => {
      expect(parseShippingDetails(null)).toBeUndefined();
      expect(parseShippingDetails(undefined)).toBeUndefined();
    });

    it('parses shipping details array', () => {
      const input = [
        {
          __typename: 'ShippingDetailType',
          id: 1,
          name: 'PostNord',
          parcelNumber: 'PN-123',
          shippingDate: '2025-01-20',
          shippingId: 10,
          trackingLink: 'https://track.example.com/PN-123',
        },
      ];
      const result = parseShippingDetails(input as any);
      expect(result).toHaveLength(1);
      expect(result![0].id).toBe('1');
      expect(result![0].name).toBe('PostNord');
      expect(result![0].trackingLink).toBe('https://track.example.com/PN-123');
    });

    it('filters out entries without __typename', () => {
      const input = [{ id: 1, name: 'No typename' }];
      const result = parseShippingDetails(input as any);
      expect(result).toEqual([]);
    });
  });

  describe('parseShippingDetail', () => {
    it('returns undefined for null', () => {
      expect(parseShippingDetail(null)).toBeUndefined();
    });

    it('converts id and shippingId to string', () => {
      const input = {
        __typename: 'ShippingDetailType',
        id: 42,
        name: 'DHL',
        shippingId: 100,
      };
      const result = parseShippingDetail(input as any);
      expect(result!.id).toBe('42');
      expect(result!.shippingId).toBe('100');
    });
  });

  describe('parsePaymentDetails', () => {
    it('returns undefined for non-array', () => {
      expect(parsePaymentDetails(null)).toBeUndefined();
      expect(parsePaymentDetails(undefined)).toBeUndefined();
    });

    it('parses payment details array', () => {
      const input = [
        {
          __typename: 'PaymentDetailsType',
          id: 1,
          paymentId: 10,
          transactionId: 'TX-1',
          displayName: 'Visa',
          name: 'Credit Card',
          isPaid: true,
          paymentDate: '2025-01-15',
          paymentFee: 25,
          paymentOption: 'visa',
          shippingFee: 50,
          total: 500,
        },
      ];
      const result = parsePaymentDetails(input as any);
      expect(result).toHaveLength(1);
      expect(result![0].displayName).toBe('Visa');
      expect(result![0].isPaid).toBe('true');
      expect(result![0].paymentFee).toBe('25');
      expect(result![0].total).toBe('500');
    });
  });

  describe('parsePaymentDetail', () => {
    it('returns undefined for null', () => {
      expect(parsePaymentDetail(null)).toBeUndefined();
    });

    it('returns undefined without __typename', () => {
      expect(parsePaymentDetail({ id: 1 } as any)).toBeUndefined();
    });

    it('converts numeric fields to strings', () => {
      const input = {
        __typename: 'PaymentDetailsType',
        id: 5,
        paymentId: 50,
        isPaid: false,
        paymentFee: 0,
        shippingFee: 30,
        total: 250,
        displayName: 'Klarna',
        name: 'Invoice',
      };
      const result = parsePaymentDetail(input as any);
      expect(result!.id).toBe('5');
      expect(result!.paymentId).toBe('50');
      expect(result!.isPaid).toBe('false');
      expect(result!.paymentFee).toBe('0');
      expect(result!.shippingFee).toBe('30');
      expect(result!.total).toBe('250');
    });
  });
});
