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

// -----

// Helper to base64 encode for the browser
function base64Encode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

// Helper to base64 decode for the browser (if needed)
function base64Decode(base64: string): string {
  base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  return decodeURIComponent(escape(atob(base64)));
}

// Update specific properties in the token claims
export function updateTokenClaimsObject(
  token: string,
  newClaims: Record<string, any>,
): Record<string, any> | null {
  const claims = authClaimTokenParse(token);
  if (!claims) {
    return null;
  }

  // Update the claims with the new properties
  return { ...claims, ...newClaims };
}

// Encode the updated claims back into a new token
export function encodeNewToken(
  updatedClaims: Record<string, any>,
  originalToken: string,
): string | null {
  try {
    // Extract the original header
    const header = originalToken.split('.')[0];

    // Encode the updated claims to base64
    const payloadEncoded = base64Encode(JSON.stringify(updatedClaims));

    // Return the new token
    return `${header}.${payloadEncoded}`;
  } catch (error) {
    console.error('Failed to encode new token:', error);
    return null;
  }
}
