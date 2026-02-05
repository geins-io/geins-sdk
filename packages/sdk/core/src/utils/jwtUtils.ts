import crypto from 'crypto';

/**
 * Decodes a JWT token and optionally verifies its signature.
 *
 * **Security warning:** When called without `secretKey`, this function performs NO
 * signature verification. The returned payload MUST NOT be trusted for authorization
 * decisions unless the token has been independently verified by the issuing authority.
 * Use the `secretKey` parameter or an external verification step before relying on claims.
 *
 * @param token - The JWT token to decode.
 * @param secretKey - The secret key to verify the signature (optional).
 * @returns An object containing the decoded header and payload.
 * @throws An error if the token is invalid or the signature verification fails (when secretKey is provided).
 */
export function decodeJWT(token: string, secretKey?: string): { header: any; payload: any } {
  if (!token) {
    throw new Error('Token is required.');
  }

  const parts = token.split('.');
  if ((parts.length !== 3 && secretKey) || (parts.length !== 2 && !secretKey)) {
    throw new Error('Invalid JWT token format.');
  }

  const [header, payload, signature] = parts;

  const decodeBase64Url = (base64Url: string): string => {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = atob(base64);
    return decodeURIComponent(
      json
        .split('')
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
  };

  // Decode the header and payload
  const decodedHeader = JSON.parse(decodeBase64Url(header));
  const decodedPayload = JSON.parse(decodeBase64Url(payload));

  // If secretKey is provided, verify the signature
  if (secretKey) {
    const computedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(`${header}.${payload}`)
      .digest('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');

    if (computedSignature !== signature) {
      throw new Error('Invalid token signature.');
    }
  }

  return { header: decodedHeader, payload: decodedPayload };
}

/**
 * Encodes a payload into a JWT token.
 *
 * @param payload - The payload to include in the token.
 * @param secretKey - The secret key used to sign the token (optional).
 * @returns The encoded JWT token.
 */
export function encodeJWT(payload: Record<string, any>, secretKey?: string): string {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Payload must be a valid object.');
  }

  const base64UrlEncode = (data: string): string =>
    btoa(data).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  // JWT header
  const header = {
    alg: secretKey ? 'HS256' : 'none',
    typ: 'JWT',
  };

  // Encode header and payload
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  if (!secretKey) {
    // Return unsigned token if no secretKey is provided
    return `${encodedHeader}.${encodedPayload}`;
  }

  // Create the signature
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(`${encodedHeader}.${encodedPayload}`)
    .digest('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  // Combine header, payload, and signature
  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
