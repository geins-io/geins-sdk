/**
 * Parses JWT claims by decoding the payload segment (base64url).
 *
 * **Security warning:** This function does NOT verify the token signature.
 * The returned claims MUST NOT be trusted for authorization decisions unless
 * the token has been independently verified by the issuing authority.
 */
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
      Array.isArray(value) ? value.map(v => `${key}=${v}`).join(';') : `${key}=${value}`,
    )
    .join(';');
}

export function authClaimsTokenSerializeToObject(token: string): Record<string, string> | null {
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
    return null;
  }
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const byteArray = new Uint8Array(buffer);
  const binaryString = byteArray.reduce((acc, byte) => acc + String.fromCharCode(byte), '');
  return btoa(binaryString);
}

export async function digest(password: string): Promise<string> {
  const salt = 'Dd1dfLonNy6Am2fXQl2AcoI+IbhLhXvaibnDNn8uEa6vbJ05eyJajSuGFm9uQSmD';
  const buffer = await crypto.subtle.digest('SHA-384', new TextEncoder().encode(password + salt));
  return arrayBufferToBase64(buffer);
}
