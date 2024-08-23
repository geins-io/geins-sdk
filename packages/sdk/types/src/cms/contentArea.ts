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

export type ContentImageSizeType = {
  imageWidth: number;
  imageHeight: number;
};

export type ContentImageType = {
  fileName: string;
  largestSize: ContentImageSizeType;
};

export type ContentType = {
  id: string;
  name: string;
  sortOrder: number;
  type: string;
  size: string;
  configuration: string;
  images: ContentImageType[];
};

export type ContentContainerType = {
  id: string;
  name: string;
  sortOrder: number;
  layout: string;
  responsiveMode: string;
  design: string;
  content: ContentType[];
};

export type ContentAreaType = {
  meta: any; // Adjust based on real meta type if available
  tags: string[];
  containers: ContentContainerType[];
};

export type PageServiceResult = {
  contentArea: ContentAreaType;
};
