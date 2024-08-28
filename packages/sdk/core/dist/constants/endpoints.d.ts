declare const API_URL = "https://merchantapi.geins.io/graphql";
declare const SIGN_URL = "https://merchantapi.geins.io/auth/sign/{API-KEY}?identity=";
declare const AUTH_URL = "https://auth-service.geins.io/api/{ACCOUNT}_{ENV}";
declare const IMAGE_URL = "https://{ACCOUNT}.commerce.services";
declare const MANAGEMENT_API_URL = "https://mgmtapi.geins.io";
declare const ENDPOINTS: {
    main: string;
    auth: string;
    auth_sign: string;
    image: string;
};
export { ENDPOINTS, MANAGEMENT_API_URL, API_URL, SIGN_URL, AUTH_URL, IMAGE_URL, };
