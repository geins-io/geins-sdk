import type { PriceType } from '../pim/product';

export type CampaignType = {
  appliedCampaigns: CampaignRuleType[];
  prices: CampaignPriceType[];
};

export type CampaignRuleType = {
  campaignId: string;
  name?: string;
  hideTitle?: boolean;
  ruleType?: string;
  category?: string;
  action?: string;
  actionValue?: string;
  canonicalUrl?: string;
};

export type CampaignPriceType = {
  quantity: number;
  discount: number;
  discountPercentage: number;
  price: PriceType;
};

export type ProductPackageCartItemType = {
  packageId: number;
  packageName: string;
  groupId: number;
  optionId: number;
};
