const API_URL = 'https://merchantapi.geins.io/graphql';
const SIGN_URL = 'https://merchantapi.geins.io/auth/sign/{API-KEY}?identity=';
const AUTH_URL = 'https://auth-service.geins.io/api/{ACCOUNT}_{ENV}/';
const IMAGE_URL = 'https://{ACCOUNT}.commerce.services';

const ENDPOINTS = {
    main: API_URL,
    auth: AUTH_URL,
    auth_sign: SIGN_URL, 
    image: IMAGE_URL
};

export { ENDPOINTS };