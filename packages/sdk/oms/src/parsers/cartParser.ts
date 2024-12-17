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
} from '@geins/types';

export function parseCart(data: any): CartType | undefined {
  const cart = findObjectWithProperty(data, '__typename', 'CartType');
  if (!cart) {
    return undefined;
  }
  return {
    id: cart.id,
    items: parseCartItems(cart.items),
    promoCode: cart.promoCode,
    freeShipping: cart.freeShipping,
    fixedDiscount: cart.fixedDiscount,
    merchantData: parseMerchantData(cart.merchantData),
    appliedCampaigns: parseCampaigns(cart.appliedCampaigns),
    summary: parseCartSummary(cart.summary),
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
      ruleType: item.ruleType || '',
      category: item.category || '',
      action: item.action || '',
      actionValue: item.actionValue || '',
      canonicalUrl: item.canonicalUrl || '',
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

function parseCartItems(data: any): CartItemType[] {
  if (!data) {
    return [];
  }
  return data.map((item: any) => {
    return {
      product: parseCartItemProduct(item.product),
      skuId: item.skuId,
      id: item.id,
      totalPrice: parsePrice(item.totalPrice),
      unitPrice: parsePrice(item.unitPrice),
      quantity: item.quantity,
      campaign: item.campaign,
      groupKey: item.groupKey,
      productPackage: item.productPackage,
      message: item.message,
    };
  });
}

function parseCartItemProduct(data: any): CartItemProductType {
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
      unitPrice: parsePrice({}),
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
    unitPrice: parsePrice(data.unitPrice),
  };
}

function parseCartSummary(data: any): CartSummaryType {
  if (!data) {
    return {
      total: parsePrice({}),
      subTotal: parsePrice({}),
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
    total: parsePrice(data.total),
    subTotal: parsePrice(data.subTotal),
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

function parsePrice(data: any): PriceType {
  return {
    sellingPriceIncVat: data?.sellingPriceIncVat || 0,
    sellingPriceExVat: data?.sellingPriceExVat || 0,
    regularPriceIncVat: data?.regularPriceIncVat || 0,
    regularPriceExVat: data?.regularPriceExVat || 0,
    discountIncVat: data?.discountIncVat || 0,
    discountExVat: data?.discountExVat || 0,
    discountPercentage: data?.discountPercentage || 0,
    vat: data?.vat || 0,
    isDiscounted: data?.isDiscounted || false,
    sellingPriceIncVatFormatted: data?.sellingPriceIncVatFormatted || '',
    sellingPriceExVatFormatted: data?.sellingPriceExVatFormatted || '',
    regularPriceIncVatFormatted: data?.regularPriceIncVatFormatted || '',
    regularPriceExVatFormatted: data?.regularPriceExVatFormatted || '',
    discountIncVatFormatted: data?.discountIncVatFormatted || '',
    discountExVatFormatted: data?.discountExVatFormatted || '',
    vatFormatted: data?.vatFormatted || '',
    currency: parseCurrency(data.currency),
  };
}

function parseCurrency(data: any): CurrencyType {
  return {
    name: data?.name || '',
    symbol: data?.symbol || '',
    code: data?.code || '',
    rate: data?.rate || 0,
  };
}
