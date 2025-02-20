const API_URL = 'https://merchantapi.geins.io/graphql';
const SIGN_URL = 'https://merchantapi.geins.io/auth/sign/{API-KEY}?identity=';
const AUTH_URL = 'https://auth-service.geins.io/api/{ACCOUNT}_{ENV}';
const IMAGE_URL = 'https://{ACCOUNT}.commerce.services';
const MANAGEMENT_API_URL = 'https://mgmtapi.geins.io';
const API_ENDPOINT_URL_HISTORY = 'https://merchantapi.geins.io/redirect/urlhistory';
const API_ENDPOINT_SLUG_HISTORY = 'https://merchantapi.geins.io/redirect/aliashistory';

const ENDPOINTS = {
  main: API_URL,
  auth: AUTH_URL,
  auth_sign: SIGN_URL,
  image: IMAGE_URL,
};

export {
  API_ENDPOINT_SLUG_HISTORY,
  API_ENDPOINT_URL_HISTORY,
  API_URL,
  AUTH_URL,
  ENDPOINTS,
  IMAGE_URL,
  MANAGEMENT_API_URL,
  SIGN_URL,
};
