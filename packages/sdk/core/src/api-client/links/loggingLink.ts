import { ApolloLink, Operation, NextLink, FetchResult } from '@apollo/client/core';
import { Observable } from '@apollo/client/core';
import { Logger } from '../../utils/logger';

/** Creates an Apollo link that logs operation start, completion, and errors via the provided {@link Logger}. */
export function createLoggingLink(logger: Logger): ApolloLink {
  return new ApolloLink((operation: Operation, forward: NextLink) => {
    const { requestId, requestStartTime } = operation.getContext();
    const operationName = operation.operationName || 'unknown';

    logger.debug(`[${requestId}] Starting ${operationName}`);

    return new Observable<FetchResult>((observer) => {
      const subscription = forward(operation).subscribe({
        next: (result) => {
          const duration = Date.now() - (requestStartTime || Date.now());
          logger.debug(`[${requestId}] ${operationName} completed in ${duration}ms`);
          observer.next(result);
        },
        error: (error) => {
          const duration = Date.now() - (requestStartTime || Date.now());
          logger.error(`[${requestId}] ${operationName} failed after ${duration}ms: ${error.message}`);
          observer.error(error);
        },
        complete: () => {
          observer.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
  });
}
