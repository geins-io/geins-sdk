import type {
  CheckoutSummaryOrderRowType,
  CheckoutSummaryOrderTotalType,
  CheckoutSummaryOrderType,
  CheckoutSummaryType,
} from '@geins/core';
import {
  CheckoutType,
  findObjectWithProperty,
  PaymentOptionCheckoutType,
  ValidateOrderConditionsResponseType,
  ValidateOrderCreationResponseType,
} from '@geins/core';
import type { PaymentOptionType, ShippingOptionType } from '@geins/core';
import {
  GeinsPaymentCheckout,
} from '@geins/types';
import type {
  GeinsCheckoutDataTypeType,
  GeinsCheckoutOrderTypeType,
  GeinsCheckoutOrderRowTypeType,
  GeinsCheckoutTypeType,
  GeinsPaymentOptionTypeType,
  GeinsShippingOptionTypeType,
  GeinsValidateOrderCreationResponseTypeType,
} from '@geins/types';
import { parseCart } from './cartParser';
import { parseAddress, parseMoneyCurrencyString } from './sharedParsers';

/**
 * Parses a raw GraphQL response into a CheckoutSummaryType.
 * @param data - Raw data potentially containing a CheckoutDataType.
 * @param locale - Locale string used for currency formatting.
 * @returns Parsed checkout summary, or undefined if not found.
 */
export function parseCheckoutSummary(data: unknown, locale: string): CheckoutSummaryType | undefined {
  const checkoutSummary = findObjectWithProperty<GeinsCheckoutDataTypeType>(data, '__typename', 'CheckoutDataType');
  if (!checkoutSummary) {
    return undefined;
  }
  return {
    htmlSnippet: checkoutSummary.htmlSnippet ?? undefined,
    order: parseCheckoutSummaryOrder(checkoutSummary.order, locale),
    nthPurchase: checkoutSummary.nthPurchase,
  };
}

/**
 * Parses a checkout order object into a normalized CheckoutSummaryOrderType.
 * @param data - Raw checkout order data.
 * @param locale - Locale string used for currency formatting.
 * @returns Parsed checkout summary order, or undefined if not found.
 */
export function parseCheckoutSummaryOrder(
  data: GeinsCheckoutOrderTypeType | null | undefined,
  locale: string,
): CheckoutSummaryOrderType | undefined {
  const order = findObjectWithProperty<GeinsCheckoutOrderTypeType>(data, '__typename', 'CheckoutOrderType');
  if (!order) {
    return undefined;
  }
  return {
    status: order.status ?? undefined,
    orderId: order.orderId ?? undefined,
    transactionId: order.transactionId ?? undefined,

    marketId: order.marketId,
    languageId: order.languageId ?? undefined,

    message: order.message ?? undefined,
    merchantData: order.metaData ?? undefined,

    customerId: order.customerId,
    customerTypeId: order.customerTypeId,
    customerGroupId: order.customerGroupId,
    organizationNumber: order.organizationNumber ?? undefined,
    ipAddress: order.ipAddress ?? undefined,

    paymentId: order.paymentId,
    shippingId: order.shippingId,
    pickupPoint: order.pickupPoint ?? undefined,
    desiredDeliveryDate: order.desiredDeliveryDate ?? undefined,

    promoCode: order.promoCode ?? undefined,
    appliedCampaignIds: order.campaignIds?.filter((s): s is string => s != null) ?? undefined,
    appliedCampaigns: order.campaignNames?.filter((s): s is string => s != null) ?? undefined,

    total: parseCheckoutSummaryOrderTotal(order, locale),
    billingAddress: parseAddress(order.billingAddress),
    shippingAddress: parseAddress(order.shippingAddress),
    rows: parseCheckoutSummaryOrderRows(order.rows, locale),
  };
}

/**
 * Computes the order total including row-level discounts and formats currency strings.
 * @param data - Raw checkout order data containing totals and rows.
 * @param locale - Locale string used for currency formatting.
 * @returns Parsed order totals with formatted strings, or undefined if data is falsy.
 */
export function parseCheckoutSummaryOrderTotal(
  data: GeinsCheckoutOrderTypeType,
  locale: string,
): CheckoutSummaryOrderTotalType | undefined {
  const total = { ...data };
  if (!total) {
    return undefined;
  }

  let discountExVat = total.discountExVat ?? 0;
  let discountIncVat = total.discountIncVat ?? 0;

  if (data.rows) {
    data.rows.forEach((row: GeinsCheckoutOrderRowTypeType | null) => {
      if (row && row.discountExVat) {
        discountExVat = discountExVat + (row.discountExVat || 0);
        discountIncVat = discountIncVat + (row.discountIncVat || 0);
      }
    });
  }

  const currency = total.currency ?? '';

  return {
    itemValueExVat: total.itemValueExVat,
    itemValueExVatFormatted: parseMoneyCurrencyString(total.itemValueExVat, locale, currency),
    itemValueIncVat: total.itemValueIncVat,
    itemValueIncVatFormatted: parseMoneyCurrencyString(total.itemValueIncVat, locale, currency),
    orderValueExVat: total.orderValueExVat,
    orderValueExVatFormatted: parseMoneyCurrencyString(total.orderValueExVat, locale, currency),
    orderValueIncVat: total.orderValueIncVat,
    orderValueIncVatFormatted: parseMoneyCurrencyString(total.orderValueIncVat, locale, currency),
    paymentFeeExVat: total.paymentFeeExVat,
    paymentFeeExVatFormatted: parseMoneyCurrencyString(total.paymentFeeExVat, locale, currency),
    paymentFeeIncVat: total.paymentFeeIncVat,
    paymentFeeIncVatFormatted: parseMoneyCurrencyString(total.paymentFeeIncVat, locale, currency),
    shippingFeeExVat: total.shippingFeeExVat,
    shippingFeeExVatFormatted: parseMoneyCurrencyString(total.shippingFeeExVat, locale, currency),
    shippingFeeIncVat: total.shippingFeeIncVat,
    shippingFeeIncVatFormatted: parseMoneyCurrencyString(total.shippingFeeIncVat, locale, currency),
    discountExVat: discountExVat,
    discountExVatFormatted: parseMoneyCurrencyString(discountExVat, locale, currency),
    discountIncVat: discountIncVat,
    discountIncVatFormatted: parseMoneyCurrencyString(discountIncVat, locale, currency),
    sum: total.sum,
    sumFormatted: parseMoneyCurrencyString(total.sum, locale, currency),
    currency: total.currency ?? undefined,
  };
}

/**
 * Parses and combines checkout order rows, merging duplicates by SKU/article/price key.
 * @param data - Raw array of checkout order rows.
 * @param locale - Locale string used for currency formatting.
 * @returns Deduplicated order rows with aggregated quantities and prices, or undefined if data is null.
 */
export function parseCheckoutSummaryOrderRows(
  data: Array<GeinsCheckoutOrderRowTypeType | null> | null | undefined,
  locale: string,
): CheckoutSummaryOrderRowType[] | undefined {
  const rows = data;
  if (!rows) {
    return undefined;
  }
  const combinedRows: { [key: string]: CheckoutSummaryOrderRowType } = {};
  rows.forEach((row: GeinsCheckoutOrderRowTypeType | null) => {
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

/**
 * Parses a single checkout order row with product and price details.
 * @param data - Raw checkout order row data.
 * @param locale - Locale string used for currency formatting.
 * @returns Parsed order row, or undefined if no CheckoutOrderRowType found.
 */
export function parseCheckoutSummaryOrderRow(
  data: GeinsCheckoutOrderRowTypeType | null | undefined,
  locale: string,
): CheckoutSummaryOrderRowType | undefined {
  const row = findObjectWithProperty<GeinsCheckoutOrderRowTypeType>(data, '__typename', 'CheckoutOrderRowType');
  if (!row) {
    return undefined;
  }
  const currency = row.currency ?? '';
  return {
    quantity: row.quantity,
    skuId: row.sku ?? undefined,
    articleNumber: row.articleNumber ?? undefined,
    gtin: row.gtin ?? undefined,
    name: row.variant ?? undefined,
    weight: row.weight,
    height: row.height,
    length: row.length,
    width: row.width,
    message: row.message ?? undefined,
    product: {
      name: row.name ?? undefined,
      brand: row.brand ?? undefined,
      imageUrl: row.imageUrl ?? undefined,
      categories: row.categories?.filter((s): s is string => s != null) ?? undefined,
      productId: row.productId,
      productUrl: row.productUrl ?? undefined,
    },
    price: {
      campaignIds: row.campaignIds?.filter((s): s is string => s != null) ?? undefined,
      campaignNames: row.campaignNames?.filter((s): s is string => s != null) ?? undefined,
      productPriceCampaignId: row.productPriceCampaignId != null ? String(row.productPriceCampaignId) : undefined,
      productPriceListId: row.productPriceListId != null ? String(row.productPriceListId) : undefined,
      discountRate: row.discountRate,
      discountExVat: row.discountExVat,
      discountExVatFormatted: parseMoneyCurrencyString(row.discountExVat, locale, currency),
      discountIncVat: row.discountIncVat,
      discountIncVatFormatted: parseMoneyCurrencyString(row.discountIncVat, locale, currency),
      priceExVat: row.priceExVat,
      priceExVatFormatted: parseMoneyCurrencyString(row.priceExVat, locale, currency),
      priceIncVat: row.priceIncVat,
      priceIncVatFormatted: parseMoneyCurrencyString(row.priceIncVat, locale, currency),
      currency: row.currency ?? undefined,
    },
  };
}

/**
 * Parses a raw GraphQL response into a normalized CheckoutType with cart, addresses, and options.
 * @param data - Raw data potentially containing a CheckoutType.
 * @param locale - Locale string used for currency formatting.
 * @returns Parsed checkout, or undefined if no CheckoutType found.
 */
export function parseCheckout(data: unknown, locale: string): CheckoutType | undefined {
  const checkout = findObjectWithProperty<GeinsCheckoutTypeType>(data, '__typename', 'CheckoutType');
  if (!checkout) {
    return undefined;
  }

  return {
    email: checkout.email ?? undefined,
    identityNumber: checkout.identityNumber ?? undefined,
    cart: parseCart(checkout.cart, locale),
    paymentOptions: parsePaymentOptions(checkout.paymentOptions),
    shippingOptions: parseShippingOptions(checkout.shippingOptions),
    billingAddress: parseAddress(checkout.billingAddress),
    shippingAddress: parseAddress(checkout.shippingAddress),
  };
}

const paymentCheckoutTypeMap: Record<GeinsPaymentCheckout, PaymentOptionCheckoutType> = {
  [GeinsPaymentCheckout.StandardType]: PaymentOptionCheckoutType.STANDARD,
  [GeinsPaymentCheckout.ExternalType]: PaymentOptionCheckoutType.EXTERNAL,
  [GeinsPaymentCheckout.GeinsPayType]: PaymentOptionCheckoutType.GEINS_PAY,
};

function toPaymentOptionCheckoutType(
  value: GeinsPaymentCheckout | null | undefined,
): PaymentOptionCheckoutType | undefined {
  if (value == null) {
    return undefined;
  }
  return paymentCheckoutTypeMap[value] ?? undefined;
}

function parsePaymentOptions(
  data: Array<GeinsPaymentOptionTypeType | null> | null | undefined,
): PaymentOptionType[] | undefined {
  if (!data) {
    return undefined;
  }
  return data
    .filter((o): o is GeinsPaymentOptionTypeType => o != null)
    .map((o) => ({
      id: o.id,
      name: o.name ?? undefined,
      displayName: o.displayName ?? undefined,
      logo: o.logo ?? undefined,
      feeIncVat: o.feeIncVat,
      feeExVat: o.feeExVat,
      isDefault: o.isDefault,
      isSelected: o.isSelected,
      checkoutType: toPaymentOptionCheckoutType(o.checkoutType),
      paymentType: o.paymentType ?? undefined,
      paymentData: o.paymentData ?? undefined,
    }));
}

function parseShippingOptions(
  data: Array<GeinsShippingOptionTypeType | null> | null | undefined,
): ShippingOptionType[] | undefined {
  if (!data) {
    return undefined;
  }
  return data
    .filter((o): o is GeinsShippingOptionTypeType => o != null)
    .map((o) => ({
      id: o.id,
      name: o.name ?? undefined,
      displayName: o.displayName ?? undefined,
      feeIncVat: o.feeIncVat,
      feeExVat: o.feeExVat,
      isDefault: o.isDefault,
      isSelected: o.isSelected,
      externalId: o.externalId ?? undefined,
      shippingData: o.shippingData ?? undefined,
      amountLeftToFreeShipping: o.amountLeftToFreeShipping,
      logo: o.logo ?? undefined,
      subOptions: parseShippingOptions(o.subOptions) ?? undefined,
      amountLeftToFreeShippingFormatted: o.amountLeftToFreeShippingFormatted ?? undefined,
      feeIncVatFormatted: o.feeIncVatFormatted ?? undefined,
      feeExVatFormatted: o.feeExVatFormatted ?? undefined,
    }));
}

/**
 * Parses the order creation validation response.
 * @param data - Raw data potentially containing a ValidateOrderCreationResponseType.
 * @returns Validation result with isValid, message, and customerGroup, or undefined if not found.
 */
export function parseValidateOrder(data: unknown): ValidateOrderCreationResponseType | undefined {
  const validateOrder = findObjectWithProperty<GeinsValidateOrderCreationResponseTypeType>(
    data,
    '__typename',
    'ValidateOrderCreationResponseType',
  );
  if (!validateOrder) {
    return undefined;
  }

  return {
    isValid: validateOrder.isValid,
    message: validateOrder.message ?? undefined,
    customerGroup: validateOrder.memberType ?? undefined,
  };
}

/**
 * Parses the order conditions validation response.
 * @param data - Raw data potentially containing a ValidateOrderCreationResponseType.
 * @returns Validation result with isValid and message, or undefined if not found.
 */
export function parseValidateOrderConditions(data: unknown): ValidateOrderConditionsResponseType | undefined {
  const validateOrder = findObjectWithProperty<GeinsValidateOrderCreationResponseTypeType>(
    data,
    '__typename',
    'ValidateOrderCreationResponseType',
  );
  if (!validateOrder) {
    return undefined;
  }

  return {
    isValid: validateOrder.isValid,
    message: validateOrder.message ?? '',
  };
}
