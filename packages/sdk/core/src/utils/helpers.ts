import { ENDPOINTS } from '../constants';
export function isServerContext() {
  return typeof window === 'undefined';
}

export function buildEndpoints(
  accountName: string,
  apiKey: string,
  environment: string = 'prod',
) {
  return {
    main: ENDPOINTS.main,
    auth: ENDPOINTS.auth
      .replace('{ACCOUNT}', accountName)
      .replace('{ENV}', environment),
    authSign: ENDPOINTS.auth_sign.replace('{API-KEY}', apiKey),
    image: ENDPOINTS.image.replace('{ACCOUNT}', accountName),
  };
}

export function authClaimTokenParse(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) throw new Error('Invalid token format: missing payload');

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedString = atob(base64);
    return JSON.parse(decodedString);
  } catch (error) {
    console.error('Failed to decode token claims:', error);
    return null;
  }
}

export function authClaimsTokenSerialize(token: string): string {
  const claims = authClaimTokenParse(token);
  if (!claims) return '';

  return Object.entries(claims)
    .map(([key, value]) =>
      Array.isArray(value)
        ? value.map((v) => `${key}=${v}`).join(';')
        : `${key}=${value}`,
    )
    .join(';');
}

export function authClaimsTokenSerializeToObject(
  token: string,
): Record<string, string> | null {
  try {
    const serializedClaims = authClaimsTokenSerialize(token);
    if (!serializedClaims) return null;

    const obj = serializedClaims.split(';').reduce(
      (acc, pair) => {
        let [key, value] = pair.split('=');
        if (key.includes('/')) {
          key = key.split('/').pop() || key;
        }
        key = key.charAt(0).toLowerCase() + key.slice(1);
        acc[key] = value;
        return acc;
      },
      {} as Record<string, string>,
    );

    return obj;
  } catch (error) {
    console.error('Failed to serialize token claims to object:', error);
    return null;
  }
}
