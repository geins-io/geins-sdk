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
