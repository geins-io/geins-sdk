import { ApolloLink, FetchResult, NextLink, Observable, Operation } from '@apollo/client/core';
import { TimeoutError } from '../../errors/networkError';

/**
 * Creates an Apollo link that aborts operations exceeding the given timeout, throwing a {@link TimeoutError}.
 * An operation's own `timeoutMs` context value takes precedence over `defaultTimeoutMs`.
 */
export function createTimeoutLink(defaultTimeoutMs: number): ApolloLink {
  return new ApolloLink((operation: Operation, forward: NextLink) => {
    const { timeoutMs: own } = operation.getContext();
    const timeoutMs = typeof own === 'number' && own > 0 ? own : defaultTimeoutMs;
    if (timeoutMs <= 0) {
      return forward(operation);
    }

    return new Observable<FetchResult>((observer) => {
      let completed = false;

      const timer = setTimeout(() => {
        if (!completed) {
          completed = true;
          const { requestId } = operation.getContext();
          observer.error(new TimeoutError(requestId || 'unknown', timeoutMs));
        }
      }, timeoutMs);

      const subscription = forward(operation).subscribe({
        next: (result) => {
          if (!completed) {
            observer.next(result);
          }
        },
        error: (error) => {
          if (!completed) {
            completed = true;
            clearTimeout(timer);
            observer.error(error);
          }
        },
        complete: () => {
          if (!completed) {
            completed = true;
            clearTimeout(timer);
            observer.complete();
          }
        },
      });

      return () => {
        completed = true;
        clearTimeout(timer);
        subscription.unsubscribe();
      };
    });
  });
}
