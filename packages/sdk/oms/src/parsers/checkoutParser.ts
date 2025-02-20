import type {
  CheckoutSummaryOrderRowType,
  CheckoutSummaryOrderTotalType,
  CheckoutSummaryOrderType,
  CheckoutSummaryType,
} from '@geins/core';
import { CheckoutType, findObjectWithProperty, ValidateOrderCreationResponseType } from '@geins/core';
import { parseCart } from './cartParser';
import { parseAddress, parseMoneyCurrencyString } from './sharedParsers';

export function parseCheckoutSummary(data: any, locale: string): CheckoutSummaryType | undefined {
  const checkoutSummary = findObjectWithProperty(data, '__typename', 'CheckoutDataType');
  if (!checkoutSummary) {
    return undefined;
  }
  return {
    htmlSnippet: checkoutSummary.htmlSnippet,
    order: parseCheckoutSummaryOrder(checkoutSummary.order, locale),
    nthPurchase: checkoutSummary.nthPurchase,
  };
}

export function parseCheckoutSummaryOrder(data: any, locale: string): CheckoutSummaryOrderType | undefined {
  const order = findObjectWithProperty(data, '__typename', 'CheckoutOrderType');
  if (!order) {
    return undefined;
  }
  return {
    status: order.status,
    orderId: order.orderId,
    transactionId: order.transactionId,

    marketId: order.marketId,
    languageId: order.languageId,

    message: order.message,
    merchantData: order.merchantData,

    customerId: order.customerId,
    customerTypeId: order.customerTypeId,
    customerGroupId: order.customerGroupId,
    organizationNumber: order.organizationNumber,
    ipAddress: order.ipAddress,

    paymentId: order.paymentId,
    shippingId: order.shippingId,
    pickupPoint: order.pickupPoint,
    desiredDeliveryDate: order.desiredDeliveryDate,

    promoCode: order.promoCode,
    appliedCampaignIds: order.campaignIds,
    appliedCampaigns: order.campaignNames,

    total: parseCheckoutSummaryOrderTotal(order, locale),
    billingAddress: parseAddress(order.billingAddress),
    shippingAddress: parseAddress(order.shippingAddress),
    rows: parseCheckoutSummaryOrderRows(order.rows, locale),
  };
}

export function parseCheckoutSummaryOrderTotal(
  data: any,
  locale: string,
): CheckoutSummaryOrderTotalType | undefined {
  const total = { ...data };
  if (!total) {
    return undefined;
  }

  if (data.rows) {
    data.rows.forEach((row: any) => {
      if (row && row.discountExVat) {
        total.discountExVat = (total.discountExVat || 0) + (row.discountExVat || 0);
        total.discountIncVat = (total.discountIncVat || 0) + (row.discountIncVat || 0);
      }
    });
  }

  return {
    itemValueExVat: total.itemValueExVat,
    itemValueExVatFormatted: parseMoneyCurrencyString(total.itemValueExVat, locale, total.currency),
    itemValueIncVat: total.itemValueIncVat,
    itemValueIncVatFormatted: parseMoneyCurrencyString(total.itemValueIncVat, locale, total.currency),
    orderValueExVat: total.orderValueExVat,
    orderValueExVatFormatted: parseMoneyCurrencyString(total.orderValueExVat, locale, total.currency),
    orderValueIncVat: total.orderValueIncVat,
    orderValueIncVatFormatted: parseMoneyCurrencyString(total.orderValueIncVat, locale, total.currency),
    paymentFeeExVat: total.paymentFeeExVat,
    paymentFeeExVatFormatted: parseMoneyCurrencyString(total.paymentFeeExVat, locale, total.currency),
    paymentFeeIncVat: total.paymentFeeIncVat,
    paymentFeeIncVatFormatted: parseMoneyCurrencyString(total.paymentFeeIncVat, locale, total.currency),
    shippingFeeExVat: total.shippingFeeExVat,
    shippingFeeExVatFormatted: parseMoneyCurrencyString(total.shippingFeeExVat, locale, total.currency),
    shippingFeeIncVat: total.shippingFeeIncVat,
    shippingFeeIncVatFormatted: parseMoneyCurrencyString(total.shippingFeeIncVat, locale, total.currency),
    discountExVat: total.discountExVat,
    discountExVatFormatted: parseMoneyCurrencyString(total.discountExVat, locale, total.currency),
    discountIncVat: total.discountIncVat,
    discountIncVatFormatted: parseMoneyCurrencyString(total.discountIncVat, locale, total.currency),
    sum: total.sum,
    sumFormatted: parseMoneyCurrencyString(total.sum, locale, total.currency),
    currency: total.currency,
  };
}

export function parseCheckoutSummaryOrderRows(
  data: any,
  locale: string,
): CheckoutSummaryOrderRowType[] | undefined {
  const rows = data;
  if (!rows) {
    return undefined;
  }
  const combinedRows: { [key: string]: CheckoutSummaryOrderRowType } = {};
  rows.forEach((row: any) => {
    const parsedRow = parseCheckoutSummaryOrderRow(row, locale);
    if (!parsedRow) {
      return;
    }
    const key = `${parsedRow.skuId}-${parsedRow.articleNumber}-${parsedRow.price}-${parsedRow.price?.currency || ''}-${parsedRow.message}`;
    const existingRow = combinedRows[key];
    if (
      parsedRow &&
      existingRow &&
      existingRow.quantity !== undefined &&
      parsedRow.quantity !== undefined &&
      existingRow.price &&
      parsedRow.price
    ) {
      existingRow.quantity += parsedRow.quantity;
      existingRow.price.discountExVat =
        (existingRow.price.discountExVat || 0) + (parsedRow.price.discountExVat || 0);
      existingRow.price.discountIncVat =
        (existingRow.price.discountIncVat || 0) + (parsedRow.price.discountIncVat || 0);
      existingRow.price.priceExVat = (existingRow.price.priceExVat || 0) + (parsedRow.price.priceExVat || 0);
      existingRow.price.priceIncVat =
        (existingRow.price.priceIncVat || 0) + (parsedRow.price.priceIncVat || 0);

      if (existingRow.price.currency) {
        existingRow.price.discountExVatFormatted = parseMoneyCurrencyString(
          existingRow.price.discountExVat,
          locale,
          existingRow.price.currency,
        );
        existingRow.price.discountIncVatFormatted = parseMoneyCurrencyString(
          existingRow.price.discountIncVat,
          locale,
          existingRow.price.currency,
        );
        existingRow.price.priceExVatFormatted = parseMoneyCurrencyString(
          existingRow.price.priceExVat,
          locale,
          existingRow.price.currency,
        );
        existingRow.price.priceIncVatFormatted = parseMoneyCurrencyString(
          existingRow.price.priceIncVat,
          locale,
          existingRow.price.currency,
        );
      }
    } else if (parsedRow) {
      combinedRows[key] = parsedRow;
    }
  });

  return Object.values(combinedRows);
}

export function parseCheckoutSummaryOrderRow(
  data: any,
  locale: string,
): CheckoutSummaryOrderRowType | undefined {
  const row = findObjectWithProperty(data, '__typename', 'CheckoutOrderRowType');
  if (!row) {
    return undefined;
  }
  return {
    quantity: row.quantity,
    skuId: row.sku,
    articleNumber: row.articleNumber,
    gtin: row.gtin,
    name: row.variant,
    weight: row.weight,
    height: row.height,
    length: row.length,
    width: row.width,
    message: row.message,
    product: {
      name: row.name,
      brand: row.brand,
      imageUrl: row.imageUrl,
      categories: row.categories,
      productId: row.productId,
      productUrl: row.productUrl,
    },
    price: {
      campaignIds: row.campaignIds,
      campaignNames: row.campaignNames,
      productPriceCampaignId: row.productPriceCampaignId,
      productPriceListId: row.productPriceListId,
      discountRate: row.discountRate,
      discountExVat: row.discountExVat,
      discountExVatFormatted: parseMoneyCurrencyString(row.discountExVat, locale, row.currency),
      discountIncVat: row.discountIncVat,
      discountIncVatFormatted: parseMoneyCurrencyString(row.discountIncVat, locale, row.currency),
      priceExVat: row.priceExVat,
      priceExVatFormatted: parseMoneyCurrencyString(row.priceExVat, locale, row.currency),
      priceIncVat: row.priceIncVat,
      priceIncVatFormatted: parseMoneyCurrencyString(row.priceIncVat, locale, row.currency),
      currency: row.currency,
    },
  };
}

export function parseCheckout(data: any, locale: string): CheckoutType | undefined {
  const checkout = findObjectWithProperty(data, '__typename', 'CheckoutType');
  if (!checkout) {
    return undefined;
  }

  return {
    email: checkout.email,
    identityNumber: checkout.identityNumber,
    cart: parseCart(checkout.cart, locale),
    paymentOptions: checkout.paymentOptions,
    shippingOptions: checkout.shippingOptions,
    billingAddress: parseAddress(checkout.billingAddress),
    shippingAddress: parseAddress(checkout.shippingAddress),
  };
}

export function parseValidateOrder(data: any): ValidateOrderCreationResponseType | undefined {
  const validateOrder = findObjectWithProperty(data, '__typename', 'ValidateOrderCreationResponseType');
  if (!validateOrder) {
    return undefined;
  }

  return {
    isValid: validateOrder.isValid,
    message: validateOrder.message,
    customerGroup: validateOrder.memberType,
  };
}
