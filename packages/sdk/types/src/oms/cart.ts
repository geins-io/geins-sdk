import type { ProductType, StockType } from '../pim/product';
import type { PriceType } from '../shared';
import type { CampaignType } from '../pim/campaign';

export type CartType = {
  id: string;
  items: CartItemType[];
  promoCode?: string;
  freeShipping: boolean;
  fixedDiscount: number;
  merchantData?: string;
  appliedCampaigns: any[];
  summary: any;
};

export type CartItemInputType = {
  skuId?: number;
  id?: string;
  groupKey?: string;
  quantity: number;
  message?: string;
};

export type CartItemProductType = {
  productId: string;
  articleNumber: string;
  brand: {
    name: string;
  };
  name: string;
  productImages: {
    fileName: string;
  }[];
  alias: string;
  canonicalUrl: string;
  primaryCategory: {
    name: string;
  };
  skus: {
    skuId: string;
    name: string;
    stock: StockType;
  }[];
  unitPrice: PriceType;
};

export type CartItemType = {
  product: ProductType;
  skuId: number;
  id: string;
  totalPrice: PriceType;
  unitPrice: PriceType;
  quantity: number;
  campaign: CampaignType;
  groupKey?: string;
  productPackage?: ProductPackageCartItemType;
  message?: string;
};

export type ProductPackageCartItemType = {
  packageId: number;
  packageName: string;
  groupId: number;
  optionId: number;
};

export type CartSummaryType = {
  total: PriceType;
  subTotal: PriceType;
  vats: VatGroupType[];
  fees: CartFeesType;
  balance: BalanceType;
  fixedAmountDiscountIncVat: number;
  fixedAmountDiscountExVat: number;
  shipping: ShippingOptionType;
  payment: PaymentOptionType;
};

export type VatGroupType = {
  rate: number;
  amount: number;
};

export type CartFeesType = {
  paymentFeeIncVat: number;
  paymentFeeExVat: number;
  shippingFeeIncVat: number;
  shippingFeeExVat: number;
};

export type BalanceType = {
  pending: number;
  pendingFormatted: string;
  totalSellingPriceExBalanceExVat: number;
  totalSellingPriceExBalanceIncVat: number;
  totalSellingPriceExBalanceIncVatFormatted: string;
};

export type ShippingOptionType = {
  id: number;
  name?: string;
  displayName?: string;
  feeIncVat: number;
  feeExVat: number;
  isDefault: boolean;
  isSelected: boolean;
  externalId?: string;
  shippingData?: string;
  amountLeftToFreeShipping: number;
  logo?: string;
  subOptions?: ShippingOptionType[];
  amountLeftToFreeShippingFormatted?: string;
  feeIncVatFormatted?: string;
  feeExVatFormatted?: string;
};

export type PaymentOptionType = {
  id: number;
  name?: string;
  displayName?: string;
  logo?: string;
  feeIncVat: number;
  feeExVat: number;
  isDefault: boolean;
  isSelected: boolean;
  paymentType?: string;
  paymentData?: string;
};
