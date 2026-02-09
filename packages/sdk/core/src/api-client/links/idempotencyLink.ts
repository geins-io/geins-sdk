import { ApolloLink, Operation, NextLink } from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { REQUEST_HEADERS } from '../../constants/headerNames';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Creates an Apollo link that attaches an idempotency key header to mutation operations. */
export function createIdempotencyLink(): ApolloLink {
  return new ApolloLink((operation: Operation, forward: NextLink) => {
    const definition = getMainDefinition(operation.query);
    const isMutation = definition.kind === 'OperationDefinition' && definition.operation === 'mutation';

    if (isMutation) {
      operation.setContext(({ headers = {} }: { headers?: Record<string, string> }) => ({
        headers: {
          ...headers,
          [REQUEST_HEADERS.IDEMPOTENCY_KEY]: generateUUID(),
        },
      }));
    }

    return forward(operation);
  });
}
