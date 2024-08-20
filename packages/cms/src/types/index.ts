export enum CustomerType {
    PERSON = 'PERSON',
    ORGANIZATION = 'ORGANIZATION',
}

export type KeyValue = {
    key: string,
    value: string,
};

export type ContentAreaVariabels = {
    url?: string | null, 
    alias?: string  | null,
    areaName?: string | null,    
    widgetAlias?: string | null,
    family?: string | null,      
    filters?: Array<KeyValue> | null,            
    customerType?: CustomerType | null,
    preview?: boolean | null,
    displaySetting?: string | null,
};