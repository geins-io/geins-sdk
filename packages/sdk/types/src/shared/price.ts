export type PriceType = {
  sellingPriceIncVat?: number;
  sellingPriceExVat?: number;
  regularPriceIncVat?: number;
  regularPriceExVat?: number;
  discountIncVat?: number;
  discountExVat?: number;
  discountPercentage?: number;
  vat?: number;
  isDiscounted?: boolean;
  sellingPriceIncVatFormatted?: string;
  sellingPriceExVatFormatted?: string;
  regularPriceIncVatFormatted?: string;
  regularPriceExVatFormatted?: string;
  discountIncVatFormatted?: string;
  discountExVatFormatted?: string;
  vatFormatted?: string;
};
