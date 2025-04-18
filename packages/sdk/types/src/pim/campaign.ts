import type { PriceType } from '../shared';

export type CampaignType = {
  appliedCampaigns: CampaignRuleType[];
  prices: CampaignPriceType[];
};

export type CampaignRuleType = {
  campaignId: string;
  name?: string;
  hideTitle?: boolean;
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
