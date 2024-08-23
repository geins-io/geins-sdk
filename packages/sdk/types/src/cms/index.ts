import { CustomerType, KeyValue } from '../common';

export type ContentAreaVariables = {
  url?: string | null;
  alias?: string | null;
  areaName?: string | null;
  widgetAlias?: string | null;
  family?: string | null;
  filters?: Array<KeyValue> | null;
  customerType?: CustomerType | null;
  preview?: boolean | null;
  displaySetting?: string | null;
  marketId?: string | null;
  languageId?: string | null;
};

export type MenuItemType = {
  id: string;
  label: string;
  title: string;
  canonicalUrl: string;
  type: string;
  order: number;
  targetBlank: boolean;
  children: MenuItemType[];
};

export type MenuType = {
  title: string;
  menuItems: MenuItemType[];
};

export type MenuServiceResult = {
  data: {
    getMenuAtLocation: MenuType;
  };
};
