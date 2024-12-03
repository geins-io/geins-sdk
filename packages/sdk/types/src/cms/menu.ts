import type { GeinsBaseApiVars } from '../api-client';
import { GeinsMenuTypeType } from '../generated';
import { LinkAttributeRelEnum } from '../common/index';
export interface MenuVariables extends GeinsBaseApiVars {
  menuLocationId: string;
}

export type MenuItemType = {
  id?: string;
  label?: string;
  title?: string;
  canonicalUrl?: string;
  value?: string;
  type?: string;
  order?: number;
  open?: boolean;
  hidden?: boolean;
  rel?: LinkAttributeRelEnum;
  targetBlank?: boolean;
  children?: MenuItemType[];
};

export type MenuType = {
  id: string;
  title: string;
  menuItems: MenuItemType[];
};

export interface MenuServiceResult {
  data: {
    getMenuAtLocation: GeinsMenuTypeType;
  };
}
