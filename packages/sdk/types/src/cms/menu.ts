export interface MenuItemType {
  id: string;
  label: string;
  title: string;
  canonicalUrl: string;
  type: string;
  order: number;
  targetBlank: boolean;
  children: MenuItemType[];
};

export interface MenuType {
  title: string;
  menuItems: MenuItemType[];
};

export interface MenuServiceResult {
  data: {
    getMenuAtLocation: MenuType;
  };
};
