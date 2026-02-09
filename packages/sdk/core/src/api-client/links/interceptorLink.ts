import { ApolloLink, Operation, NextLink, FetchResult } from '@apollo/client/core';
import { Observable } from '@apollo/client/core';
import type { GeinsInterceptors, GeinsRequestContext, GeinsResponseContext, GeinsErrorContext } from '@geins/types';

/** Creates an Apollo link that invokes user-defined request/response/error interceptors around each operation. */
export function createInterceptorLink(interceptors: GeinsInterceptors): ApolloLink {
  return new ApolloLink((operation: Operation, forward: NextLink) => {
    return new Observable<FetchResult>((observer) => {
      const context = operation.getContext();
      const requestId: string = context.requestId || 'unknown';
      const requestStartTime: number = context.requestStartTime || Date.now();
      const operationName = operation.operationName || 'unknown';

      const proceed = () => {
        const subscription = forward(operation).subscribe({
          next: (result) => {
            if (interceptors.onResponse) {
              const responseCtx: GeinsResponseContext = {
                requestId,
                operationName,
                durationMs: Date.now() - requestStartTime,
                data: result.data,
              };
              try {
                interceptors.onResponse(responseCtx);
              } catch {
                // Don't let interceptor errors break the response flow
              }
            }
            observer.next(result);
          },
          error: (error) => {
            if (interceptors.onError) {
              const errorCtx: GeinsErrorContext = {
                requestId,
                operationName,
                durationMs: Date.now() - requestStartTime,
                error,
                retryCount: context.retryCount || 0,
              };
              try {
                interceptors.onError(errorCtx);
              } catch {
                // Don't let interceptor errors break the error flow
              }
            }
            observer.error(error);
          },
          complete: () => {
            observer.complete();
          },
        });

        return subscription;
      };

      if (interceptors.onRequest) {
        const headers: Record<string, string> = { ...(context.headers || {}) };
        const requestCtx: GeinsRequestContext = {
          requestId,
          operationName,
          headers,
          timestamp: requestStartTime,
        };

        let subscription: ReturnType<typeof proceed> | undefined;

        try {
          const result = interceptors.onRequest(requestCtx);
          if (result && typeof (result as Promise<void>).then === 'function') {
            (result as Promise<void>)
              .then(() => {
                operation.setContext(() => ({
                  ...context,
                  headers: requestCtx.headers,
                }));
                subscription = proceed();
              })
              .catch((err) => {
                observer.error(err);
              });
          } else {
            operation.setContext(() => ({
              ...context,
              headers: requestCtx.headers,
            }));
            subscription = proceed();
          }
        } catch (err) {
          observer.error(err);
          return;
        }

        return () => {
          subscription?.unsubscribe();
        };
      }

      const subscription = proceed();
      return () => subscription.unsubscribe();
    });
  });
}
