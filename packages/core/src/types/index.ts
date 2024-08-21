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

export type GeinsManagementAPICredentials = {
    apiKey: string;
    username: string;
    password: string;
};

export type GeinsAPILocalization = {
    channelId: string;
    marketId: string;
    languageId: string;
};
