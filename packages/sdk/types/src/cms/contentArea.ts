import { CustomerType, KeyValue } from '../common';

export interface ContentAreaVariables {
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

export interface ContentImageSizeType {
  imageWidth: number;
  imageHeight: number;
};

export interface ContentImageType {
  fileName: string;
  largestSize: ContentImageSizeType;
};

export interface ContentType {
  id: string;
  name: string;
  sortOrder: number;
  type: string;
  size: string;
  configuration: string;
  images: ContentImageType[];
};

export interface ContentContainerType {
  id: string;
  name: string;
  sortOrder: number;
  layout: string;
  responsiveMode: string;
  design: string;
  content: ContentType[];
};

export interface ContentAreaType {
  meta: any; // Adjust based on real meta type if available
  tags: string[];
  containers: ContentContainerType[];
};

export interface PageServiceResult {
  contentArea: ContentAreaType;
};
