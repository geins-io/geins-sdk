// enum for environment
export enum Environment {
    PRODUCTION = 'prod',
    TEST = 'qa',
}

export type GeinsCredentialsAPI = {
    apiKey: string;
    accountName: string;
    environment?: Environment;
};

export type GeinsAPILocalization = {
    channelId: string;
    marketId: string;
    language: string;
};