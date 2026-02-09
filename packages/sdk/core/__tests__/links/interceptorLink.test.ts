import { ApolloLink, execute, gql, Observable } from '@apollo/client/core';
import { createInterceptorLink } from '../../src/api-client/links/interceptorLink';
import { createRequestIdLink } from '../../src/api-client/links/requestIdLink';
import type { GeinsInterceptors, GeinsRequestContext, GeinsResponseContext, GeinsErrorContext } from '@geins/types';

const TEST_QUERY = gql`
  query TestOp {
    test
  }
`;

function createSuccessLink(): ApolloLink {
  return new ApolloLink(() => {
    return new Observable((observer) => {
      observer.next({ data: { test: true } });
      observer.complete();
    });
  });
}

function createErrorLink(): ApolloLink {
  return new ApolloLink(() => {
    return new Observable((observer) => {
      observer.error(new Error('server error'));
    });
  });
}

describe('InterceptorLink', () => {
  it('calls onRequest before forwarding', (done) => {
    const onRequest = jest.fn();
    const interceptors: GeinsInterceptors = { onRequest };

    const link = ApolloLink.from([
      createRequestIdLink(),
      createInterceptorLink(interceptors),
      createSuccessLink(),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: () => {
        expect(onRequest).toHaveBeenCalledTimes(1);
        const ctx: GeinsRequestContext = onRequest.mock.calls[0][0];
        expect(ctx.requestId).toBeDefined();
        expect(ctx.operationName).toBe('TestOp');
        expect(ctx.timestamp).toBeGreaterThan(0);
        expect(ctx.headers).toBeDefined();
        done();
      },
    });
  });

  it('allows onRequest to modify headers', (done) => {
    const interceptors: GeinsInterceptors = {
      onRequest: (ctx) => {
        ctx.headers['x-custom'] = 'test-value';
      },
    };

    let capturedHeaders: Record<string, string> | undefined;

    const captureLink = new ApolloLink((operation) => {
      capturedHeaders = operation.getContext().headers;
      return new Observable((observer) => {
        observer.next({ data: { test: true } });
        observer.complete();
      });
    });

    const link = ApolloLink.from([
      createRequestIdLink(),
      createInterceptorLink(interceptors),
      captureLink,
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: () => {
        expect(capturedHeaders?.['x-custom']).toBe('test-value');
        done();
      },
    });
  });

  it('calls onResponse on success', (done) => {
    const onResponse = jest.fn();
    const interceptors: GeinsInterceptors = { onResponse };

    const link = ApolloLink.from([
      createRequestIdLink(),
      createInterceptorLink(interceptors),
      createSuccessLink(),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: () => {
        expect(onResponse).toHaveBeenCalledTimes(1);
        const ctx: GeinsResponseContext = onResponse.mock.calls[0][0];
        expect(ctx.requestId).toBeDefined();
        expect(ctx.operationName).toBe('TestOp');
        expect(ctx.durationMs).toBeGreaterThanOrEqual(0);
        expect(ctx.data).toEqual({ test: true });
        done();
      },
    });
  });

  it('calls onError on failure', (done) => {
    const onError = jest.fn();
    const interceptors: GeinsInterceptors = { onError };

    const link = ApolloLink.from([
      createRequestIdLink(),
      createInterceptorLink(interceptors),
      createErrorLink(),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      error: () => {
        expect(onError).toHaveBeenCalledTimes(1);
        const ctx: GeinsErrorContext = onError.mock.calls[0][0];
        expect(ctx.requestId).toBeDefined();
        expect(ctx.operationName).toBe('TestOp');
        expect(ctx.durationMs).toBeGreaterThanOrEqual(0);
        expect(ctx.error.message).toBe('server error');
        expect(ctx.retryCount).toBe(0);
        done();
      },
    });
  });

  it('supports async onRequest', (done) => {
    const callOrder: string[] = [];

    const interceptors: GeinsInterceptors = {
      onRequest: async (ctx) => {
        callOrder.push('onRequest-start');
        await new Promise((resolve) => setTimeout(resolve, 10));
        ctx.headers['x-async'] = 'async-value';
        callOrder.push('onRequest-end');
      },
    };

    let capturedHeaders: Record<string, string> | undefined;

    const captureLink = new ApolloLink((operation) => {
      callOrder.push('forward');
      capturedHeaders = operation.getContext().headers;
      return new Observable((observer) => {
        observer.next({ data: { test: true } });
        observer.complete();
      });
    });

    const link = ApolloLink.from([
      createRequestIdLink(),
      createInterceptorLink(interceptors),
      captureLink,
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: () => {
        expect(callOrder).toEqual(['onRequest-start', 'onRequest-end', 'forward']);
        expect(capturedHeaders?.['x-async']).toBe('async-value');
        done();
      },
    });
  });

  it('works with no interceptor callbacks', (done) => {
    const interceptors: GeinsInterceptors = {};

    const link = ApolloLink.from([
      createRequestIdLink(),
      createInterceptorLink(interceptors),
      createSuccessLink(),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      next: (result) => {
        expect(result.data).toEqual({ test: true });
      },
      complete: done,
    });
  });

  it('does not break response flow if onResponse throws', (done) => {
    const interceptors: GeinsInterceptors = {
      onResponse: () => {
        throw new Error('interceptor bug');
      },
    };

    const link = ApolloLink.from([
      createRequestIdLink(),
      createInterceptorLink(interceptors),
      createSuccessLink(),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      next: (result) => {
        expect(result.data).toEqual({ test: true });
      },
      complete: done,
    });
  });

  it('does not break error flow if onError throws', (done) => {
    const interceptors: GeinsInterceptors = {
      onError: () => {
        throw new Error('interceptor bug');
      },
    };

    const link = ApolloLink.from([
      createRequestIdLink(),
      createInterceptorLink(interceptors),
      createErrorLink(),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      error: (error) => {
        expect(error.message).toBe('server error');
        done();
      },
    });
  });
});
