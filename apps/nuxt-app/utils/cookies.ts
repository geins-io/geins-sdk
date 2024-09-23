import { CookieService } from '@geins/core';

const cookieService = new CookieService();
export interface CookieArrayItem {
  name: string;
  data: string;
}
export const cookies = {
  getAllCookies: (): CookieArrayItem[] => {
    const items = [];
    const allCookies = cookieService.getAll() as any;
    for (const key in allCookies) {
      items.push({
        name: key,
        data: JSON.stringify(allCookies[key], null, 2),
      });
    }
    return items;
  },
  clearCookies: () => {
    // cookieService.deleteAll();
  },
};
