import type { GeinsMenuItemTypeType } from '@geins/types';

export function parseMenuItem(item: any): GeinsMenuItemTypeType {
  return {
    id: item.id,
    label: item.label,
    title: item.title,
    canonicalUrl: item.canonicalUrl,
    type: item.type,
    order: item.order,
    open: item.open,
    hidden: item.hidden,
    targetBlank: item.targetBlank,
    children: item.children
      ? item.children.map((child: any) => parseMenuItem(child))
      : [],
  };
}
