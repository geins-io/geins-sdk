import type { PriceType, ShippingOptionType, PaymentOptionType } from '../shared';
import type { StockType } from '../pim/product';
import type { CampaignRuleType } from '../shared/campaign';
import type { CampaignType } from '../pim/campaign';

export type CartType = {
  id: string;
  items: CartItemType[];
  freeShipping: boolean;
  readonly completed: boolean;
  readonly merchantData?: string;
  readonly promoCode?: string;
  readonly fixedDiscount: number;
  readonly appliedCampaigns: CampaignRuleType[];
  readonly summary: CartSummaryType;
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

export enum ItemType {
  PRODUCT = 'PRODUCT',
  PACKAGE = 'PACKAGE',
}

export type CartItemType = {
  id?: string;
  groupKey?: string;
  type?: ItemType;
  title?: string;
  product?: CartItemProductType;
  skuId?: number;
  quantity: number;
  campaign?: CampaignType;
  productPackage?: ProductPackageCartItemType;
  productPackageCartItems?: CartItemType[];
  message?: string;
  totalPrice?: PriceType;
  unitPrice?: PriceType;
};

export type CartGroupInputType = {
  groupKey: string;
  quantity: number;
};

export type ProductPackageCartItemType = {
  packageId: number;
  packageName: string;
  groupId: number;
  optionId: number;
};

export type ProductPackageSelectionType = {
  groupId: number;
  optionId: number;
  skuId: number;
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
