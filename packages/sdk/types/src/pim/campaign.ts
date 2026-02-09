import type { PriceType } from '../shared';
import type { CampaignRuleType } from '../shared/campaign';

export type CampaignType = {
  appliedCampaigns: CampaignRuleType[];
  prices: CampaignPriceType[];
};

export type CampaignPriceType = {
  quantity: number;
  discount: number;
  discountPercentage: number;
  price: PriceType;
};
