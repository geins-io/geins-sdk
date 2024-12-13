import type { ProductType, PriceType } from '../pim/product';
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
