export function authClaimTokenParse(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) {
      return null;
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedString = atob(base64);
    return JSON.parse(decodedString);
  } catch (error) {
    return null;
  }
}

export function authClaimsTokenSerialize(token: string): string | null {
  const claims = authClaimTokenParse(token);
  if (!claims) {
    return null;
  }

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
    if (!serializedClaims) {
      return null;
    }

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
    //console.error('Failed to serialize token claims to object:', error);
    return null;
  }
}
