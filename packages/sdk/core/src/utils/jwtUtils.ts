import crypto from 'crypto';
import { GeinsError, GeinsErrorCode } from '../errors/geinsError';

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
export function decodeJWT(token: string, secretKey?: string): { header: Record<string, unknown>; payload: Record<string, unknown> } {
  if (!token) {
    throw new GeinsError('Token is required.', GeinsErrorCode.INVALID_ARGUMENT);
  }

  const parts = token.split('.');
  if ((parts.length !== 3 && secretKey) || (parts.length !== 2 && !secretKey)) {
    throw new GeinsError('Invalid JWT token format.', GeinsErrorCode.PARSE_ERROR);
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
      throw new GeinsError('Invalid token signature.', GeinsErrorCode.AUTH_FAILED);
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
export function encodeJWT(payload: Record<string, unknown>, secretKey?: string): string {
  if (!payload || typeof payload !== 'object') {
    throw new GeinsError('Payload must be a valid object.', GeinsErrorCode.INVALID_ARGUMENT);
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
