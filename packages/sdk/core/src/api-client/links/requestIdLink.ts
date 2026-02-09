import { ApolloLink, Operation, NextLink } from '@apollo/client/core';
import { REQUEST_HEADERS } from '../../constants/headerNames';
import { SDK_VERSION } from '../../version';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for environments without crypto.randomUUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Creates an Apollo link that attaches a unique request ID and SDK version header to every operation. */
export function createRequestIdLink(): ApolloLink {
  return new ApolloLink((operation: Operation, forward: NextLink) => {
    const requestId = generateUUID();
    const requestStartTime = Date.now();

    operation.setContext(({ headers = {} }: { headers?: Record<string, string> }) => ({
      headers: {
        ...headers,
        [REQUEST_HEADERS.REQUEST_ID]: requestId,
        [REQUEST_HEADERS.SDK_VERSION]: SDK_VERSION,
      },
      requestId,
      requestStartTime,
    }));

    return forward(operation);
  });
}
