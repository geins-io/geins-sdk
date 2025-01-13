import { findObjectWithProperty } from '@geins/core';
import type {
  CartType,
  CartItemType,
  CartSummaryType,
  CartItemProductType,
  PriceType,
  BalanceType,
  ShippingOptionType,
  CurrencyType,
  CampaignRuleType,
  ProductPackageCartItemType,
} from '@geins/types';
import { ItemType } from '@geins/types';
import { checkPrimeSync } from 'crypto';
import { cp } from 'fs';

export function groupCartItems(data: CartItemType[], locale: string): CartItemType[] {
  const items: CartItemType[] = [];
  const groupedItems: { [key: string]: CartItemType[] } = {};

  // Group items by groupKey
  data.forEach((item) => {
    if (item.groupKey) {
      if (!groupedItems[item.groupKey]) {
        groupedItems[item.groupKey] = [];
      }
      groupedItems[item.groupKey].push(item);
    } else {
      // Add items without a groupKey directly to the items array
      items.push(item);
    }
  });

  // Create grouped items with productPackageCartItems array
  for (const groupKey in groupedItems) {
    const group = groupedItems[groupKey];

    // Make base item from copy of the first item in the group
    const baseItem = { ...group[0] };

    // Remove data from the base item
    delete baseItem.product;
    delete baseItem.skuId;

    baseItem.productPackageCartItems = group;

    // recalculate this
    const price = calculateProductPackagePrice(baseItem, locale);
    baseItem.unitPrice = price;
    baseItem.totalPrice = price;
    items.push(baseItem);
  }

  return items;
}

function calculateProductPackagePrice(data: CartItemType, locale: string): PriceType | undefined {
  if (!data.productPackageCartItems || data.productPackageCartItems.length === 0) {
    return data.totalPrice;
  }

  let sellingPriceIncVat = 0;
  let sellingPriceExVat = 0;
  let regularPriceIncVat = 0;
  let regularPriceExVat = 0;
  let discountIncVat = 0;
  let discountExVat = 0;
  let discountPercentage = 0;
  let vat = 0;

  data.productPackageCartItems?.forEach((item) => {
    sellingPriceIncVat += item.totalPrice?.sellingPriceIncVat ?? 0;
    sellingPriceExVat += item.totalPrice?.sellingPriceExVat ?? 0;
    regularPriceIncVat += item.totalPrice?.regularPriceIncVat ?? 0;
    regularPriceExVat += item.totalPrice?.regularPriceIncVat ?? 0;
    discountIncVat += item.totalPrice?.discountIncVat ?? 0;
    discountExVat += item.totalPrice?.discountExVat ?? 0;
    discountPercentage += item.totalPrice?.discountPercentage ?? 0;
    vat += item.totalPrice?.vat ?? 0;
  });

  discountPercentage = data.productPackageCartItems
    ? Math.round((discountIncVat / data.productPackageCartItems.length) * 100)
    : 0;

  const currency = data.productPackageCartItems[0].totalPrice?.currency;

  return {
    sellingPriceIncVat: sellingPriceIncVat,
    sellingPriceExVat: sellingPriceExVat,
    regularPriceIncVat: regularPriceIncVat,
    regularPriceExVat: regularPriceExVat,
    discountIncVat: discountIncVat,
    discountExVat: discountExVat,
    discountPercentage: discountPercentage,
    vat: vat,
    isDiscounted: discountIncVat > 0,
    sellingPriceIncVatFormatted: sellingPriceIncVat.toLocaleString(locale, {
      style: 'currency',
      currency: currency?.code,
    }),
    sellingPriceExVatFormatted: sellingPriceExVat.toLocaleString(locale, {
      style: 'currency',
      currency: currency?.code,
    }),
    regularPriceIncVatFormatted: regularPriceIncVat.toLocaleString(locale, {
      style: 'currency',
      currency: currency?.code,
    }),
    regularPriceExVatFormatted: regularPriceExVat.toLocaleString(locale, {
      style: 'currency',
      currency: currency?.code,
    }),
    discountIncVatFormatted: discountIncVat.toLocaleString(locale, {
      style: 'currency',
      currency: currency?.code,
    }),
    discountExVatFormatted: discountExVat.toLocaleString(locale, {
      style: 'currency',
      currency: currency?.code,
    }),
    vatFormatted: vat.toLocaleString(locale, {
      style: 'currency',
      currency: currency?.code,
    }),
    currency: currency,
  };
}

export function parseCart(data: any, locale: string): CartType | undefined {
  const cart = findObjectWithProperty(data, '__typename', 'CartType');
  if (!cart) {
    return undefined;
  }

  return {
    id: cart.id,
    items: parseCartItems(cart.items, locale),
    completed: cart.isCompleted,
    promoCode: cart.promoCode,
    freeShipping: cart.freeShipping,
    fixedDiscount: cart.fixedDiscount,
    merchantData: parseMerchantData(cart.merchantData),
    appliedCampaigns: parseCampaigns(cart.appliedCampaigns),
    summary: parseCartSummary(cart.summary, locale),
  };
}

function parseCampaigns(data: any): CampaignRuleType[] {
  if (!data) {
    return [];
  }
  return data.map((item: any) => {
    return {
      campaignId: item.campaignId || '',
      name: item.name || '',
      hideTitle: item.hideTitle || false,
      /* ruleType: item.ruleType || '',
      category: item.category || '',
      action: item.action || '',
      actionValue: item.actionValue || '',
      canonicalUrl: item.canonicalUrl || '', */
    };
  });
}

function parseMerchantData(data: any): any {
  if (!data) {
    return;
  }
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
}

function parseCartItems(data: any, locale: string): CartItemType[] {
  if (!data) {
    return [];
  }
  return data.map((item: any) => {
    return {
      title: item.productPackage ? item.productPackage.packageName : item.product?.name,
      type: item.productPackage ? ItemType.PACKAGE : ItemType.PRODUCT,
      product: parseCartItemProduct(item.product, locale),
      skuId: item.skuId,
      id: item.id,
      totalPrice: parsePrice(item.totalPrice, locale),
      unitPrice: parsePrice(item.unitPrice, locale),
      quantity: item.quantity,
      campaign: item.campaign,
      groupKey: item.groupKey,
      productPackage: parseProductPackage(item.productPackage),
      message: item.message,
    };
  });
}

function parseProductPackage(data: any): ProductPackageCartItemType | undefined {
  if (!data) {
    return undefined;
  }

  return {
    packageId: data.packageId,
    packageName: data.packageName,
    groupId: data.groupId,
    optionId: data.optionId,
  };
}

function parseCartItemProduct(data: any, locale: string): CartItemProductType {
  if (!data) {
    return {
      productId: '',
      articleNumber: '',
      brand: { name: '' },
      name: '',
      productImages: [],
      alias: '',
      canonicalUrl: '',
      primaryCategory: { name: '' },
      skus: [],
      unitPrice: parsePrice({}, locale),
    };
  }

  return {
    productId: data.productId || '',
    articleNumber: data.articleNumber || '',
    brand: {
      name: data.brand?.name || '',
    },
    name: data.name || '',
    productImages: (data.productImages || []).map((image: any) => ({
      fileName: image.fileName || '',
    })),
    alias: data.alias || '',
    canonicalUrl: data.canonicalUrl || '',
    primaryCategory: {
      name: data.primaryCategory?.name || '',
    },
    skus: (data.skus || []).map((sku: any) => ({
      skuId: sku.skuId || '',
      name: sku.name || '',
      stock: {
        inStock: sku.stock?.inStock || 0,
        oversellable: sku.stock?.oversellable || 0,
        totalStock: sku.stock?.totalStock || 0,
        static: sku.stock?.static || 0,
      },
    })),
    unitPrice: parsePrice(data.unitPrice, locale),
  };
}

function parseCartSummary(data: any, locale: string): CartSummaryType {
  if (!data) {
    return {
      total: parsePrice({}, locale),
      subTotal: parsePrice({}, locale),
      vats: [],
      fees: {
        paymentFeeIncVat: 0,
        paymentFeeExVat: 0,
        shippingFeeIncVat: 0,
        shippingFeeExVat: 0,
      },
      balance: {
        pending: 0,
        pendingFormatted: '',
        totalSellingPriceExBalanceExVat: 0,
        totalSellingPriceExBalanceIncVat: 0,
        totalSellingPriceExBalanceIncVatFormatted: '',
      },
      fixedAmountDiscountIncVat: 0,
      fixedAmountDiscountExVat: 0,
      shipping: {
        id: 0,
        amountLeftToFreeShipping: 0,
        amountLeftToFreeShippingFormatted: '',
        feeIncVat: 0,
        feeExVat: 0,
        feeExVatFormatted: '',
        feeIncVatFormatted: '',
        isDefault: false,
        isSelected: false,
      },
      payment: {
        id: 0,
        feeIncVat: 0,
        feeExVat: 0,
        isDefault: false,
        isSelected: false,
      },
    };
  }

  return {
    total: parsePrice(data.total, locale),
    subTotal: parsePrice(data.subTotal, locale),
    vats:
      data.vats?.map((vat: any) => ({
        rate: vat.rate || 0,
        amount: vat.amount || 0,
      })) || [],
    fees: {
      paymentFeeIncVat: data.fees?.paymentFeeIncVat || 0,
      paymentFeeExVat: data.fees?.paymentFeeExVat || 0,
      shippingFeeIncVat: data.fees?.shippingFeeIncVat || 0,
      shippingFeeExVat: data.fees?.shippingFeeExVat || 0,
    },
    balance: {
      pending: data.balance?.pending || 0,
      pendingFormatted: data.balance?.pendingFormatted || '',
      totalSellingPriceExBalanceExVat: data.balance?.totalSellingPriceExBalanceExVat || 0,
      totalSellingPriceExBalanceIncVat: data.balance?.totalSellingPriceExBalanceIncVat || 0,
      totalSellingPriceExBalanceIncVatFormatted:
        data.balance?.totalSellingPriceExBalanceIncVatFormatted || '',
    },
    fixedAmountDiscountIncVat: data.fixedAmountDiscountIncVat || 0,
    fixedAmountDiscountExVat: data.fixedAmountDiscountExVat || 0,
    shipping: {
      id: data.shipping?.id || 0,
      amountLeftToFreeShipping: data.shipping?.amountLeftToFreeShipping || 0,
      amountLeftToFreeShippingFormatted: data.shipping?.amountLeftToFreeShippingFormatted || '',
      feeIncVat: data.shipping?.feeIncVat || 0,
      feeExVat: data.shipping?.feeExVat || 0,
      feeExVatFormatted: data.shipping?.feeExVatFormatted || '',
      feeIncVatFormatted: data.shipping?.feeIncVatFormatted || '',
      isDefault: data.shipping?.isDefault || false,
      isSelected: data.shipping?.isSelected || false,
    },
    payment: {
      id: data.payment?.id || 0,
      feeIncVat: data.payment?.feeIncVat || 0,
      feeExVat: data.payment?.feeExVat || 0,
      isDefault: data.payment?.isDefault || false,
      isSelected: data.payment?.isSelected || false,
    },
  };
}

function parseCurrency(data: any): CurrencyType | undefined {
  if (!data) {
    return undefined;
  }

  return {
    name: data?.name || '',
    symbol: data?.symbol || '',
    code: data?.code || '',
    rate: data?.rate || 0,
  };
}

function parsePrice(data: any, locale: string): PriceType {
  const price: PriceType = {
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
  };

  if (!data) {
    return price;
  }

  price.currency = parseCurrency(data.currency);
  price.sellingPriceIncVat = data.sellingPriceIncVat || 0;
  price.sellingPriceExVat = data.sellingPriceExVat || 0;
  price.regularPriceIncVat = data.regularPriceIncVat || 0;
  price.regularPriceExVat = data.regularPriceExVat || 0;
  price.discountIncVat = data.discountIncVat || 0;
  price.discountExVat = data.discountExVat || 0;
  price.discountPercentage = data.discountPercentage || 0;
  price.vat = data.vat || 0;
  price.isDiscounted = data.isDiscounted || false;

  if (price.currency?.code) {
    price.sellingPriceIncVatFormatted =
      data?.sellingPriceIncVat.toLocaleString(locale, {
        style: 'currency',
        currency: price.currency.code,
      }) || '';

    price.sellingPriceExVatFormatted =
      data?.sellingPriceExVat.toLocaleString(locale, {
        style: 'currency',
        currency: price.currency.code,
      }) || '';

    price.regularPriceIncVatFormatted =
      data?.regularPriceIncVat.toLocaleString(locale, {
        style: 'currency',
        currency: price.currency.code,
      }) || '';

    price.regularPriceExVatFormatted =
      data?.regularPriceExVat.toLocaleString(locale, {
        style: 'currency',
        currency: price.currency.code,
      }) || '';

    price.discountIncVatFormatted =
      data?.discountIncVat.toLocaleString(locale, {
        style: 'currency',
        currency: price.currency.code,
      }) || '';

    price.discountExVatFormatted =
      data?.discountExVat.toLocaleString(locale, {
        style: 'currency',
        currency: price.currency.code,
      }) || '';

    price.vatFormatted =
      data?.vat.toLocaleString(locale, {
        style: 'currency',
        currency: price.currency.code,
      }) || '';
  }

  return price;
}
