/* export type GeinsMarketTypeType = {
  id: string;
  alias: string;
  allowedLanguages: GeinsLanguageTypeType[];
  country: GeinsCountryTypeType;
  currency: GeinsCurrencyTypeType;
  onlyDisplayInCheckout: boolean;
  virtual: boolean;
  groupKey: string;
}; */

/* export type ChannelType = {
  id: string;
  name: string;
  type: string;
  url: string;
  defaultMarketId: string;
  defaultLanguageId: string;
  markets: GeinsMarketTypeType[];
  languages: GeinsLanguageTypeType[];
};



export type GeinsCountryTypeType = {
  name: string;
  code: string;
};

export type GeinsLanguageTypeType = {
  id: string;
  name: string;
  code: string;
};

export type GeinsCurrencyTypeType = {
  code: string;
  symbol: string;
};


 */
export type GeinsMarketLanguageType = {
  marketId: string;
  languageId: string;
};
