import type { GeinsBaseApiVars } from '../api-client';
import { GeinsMenuTypeType } from '../generated';
import { LinkAttributeRelEnum } from '../common/index';
export interface MenuVariables extends GeinsBaseApiVars {
  menuLocationId: string;
  /**
   * Levels of menu items to fetch, counting the top items as 1. Defaults to 3. Each level
   * adds to the query and the response.
   *
   * The SDK accepts 1–6. This is the SDK's own limit for navigation menus, not the API's:
   * the Merchant API itself refuses more than 60 levels (`MAX_DEPTH_EXCEEDED`, measured; not
   * documented).
   */
  depth?: number;
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
