export enum DiscountType {
  PERCENTAGE,
  FIXED_AMOUNT,
}
/* export type CampaignRuleType = {
  ruleId: number;
  description: string;
  discountType: DiscountType;
  discountValue: number;
}; */
export type CampaignRuleType = {
  campaignId?: string;
  name?: string;
  hideTitle?: boolean;
};
