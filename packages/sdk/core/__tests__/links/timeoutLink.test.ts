import { ApolloLink, execute, FetchResult, gql, Observable } from '@apollo/client/core';
import { createRequestIdLink } from '../../src/api-client/links/requestIdLink';
import { createTimeoutLink } from '../../src/api-client/links/timeoutLink';
import { TimeoutError } from '../../src/errors/networkError';

const TEST_QUERY = gql`
  query TestQuery {
    test
  }
`;

function createDelayedLink(delayMs: number): ApolloLink {
  return new ApolloLink(() => {
    return new Observable((observer) => {
      const timer = setTimeout(() => {
        observer.next({ data: { test: true } });
        observer.complete();
      }, delayMs);
      return () => clearTimeout(timer);
    });
  });
}

function createImmediateLink(): ApolloLink {
  return new ApolloLink(() => {
    return new Observable((observer) => {
      observer.next({ data: { test: true } });
      observer.complete();
    });
  });
}

describe('TimeoutLink', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('allows requests that complete before timeout', (done) => {
    jest.useRealTimers();

    const link = ApolloLink.from([createRequestIdLink(), createTimeoutLink(5000), createImmediateLink()]);

    execute(link, { query: TEST_QUERY }).subscribe({
      next: (result) => {
        expect(result.data).toEqual({ test: true });
      },
      complete: done,
    });
  });

  it('emits TimeoutError when request exceeds timeout', (done) => {
    jest.useRealTimers();

    const link = ApolloLink.from([createRequestIdLink(), createTimeoutLink(50), createDelayedLink(200)]);

    execute(link, { query: TEST_QUERY }).subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(TimeoutError);
        expect(error.timeoutMs).toBe(50);
        expect(error.requestId).toBeDefined();
        done();
      },
    });
  });

  it('passes through when timeoutMs is 0', (done) => {
    jest.useRealTimers();

    const link = ApolloLink.from([createRequestIdLink(), createTimeoutLink(0), createImmediateLink()]);

    execute(link, { query: TEST_QUERY }).subscribe({
      next: (result) => {
        expect(result.data).toEqual({ test: true });
      },
      complete: done,
    });
  });

  it('passes through when timeoutMs is negative', (done) => {
    jest.useRealTimers();

    const link = ApolloLink.from([createRequestIdLink(), createTimeoutLink(-1), createImmediateLink()]);

    execute(link, { query: TEST_QUERY }).subscribe({
      next: (result) => {
        expect(result.data).toEqual({ test: true });
      },
      complete: done,
    });
  });

  it('cleans up timer on successful completion', (done) => {
    jest.useRealTimers();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const link = ApolloLink.from([createRequestIdLink(), createTimeoutLink(5000), createImmediateLink()]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: () => {
        expect(clearTimeoutSpy).toHaveBeenCalled();
        clearTimeoutSpy.mockRestore();
        done();
      },
    });
  });

  it('cleans up timer on error from downstream', (done) => {
    jest.useRealTimers();
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

    const errorLink = new ApolloLink(() => {
      return new Observable((observer) => {
        observer.error(new Error('downstream error'));
      });
    });

    const link = ApolloLink.from([createRequestIdLink(), createTimeoutLink(5000), errorLink]);

    execute(link, { query: TEST_QUERY }).subscribe({
      error: (error) => {
        expect(error.message).toBe('downstream error');
        expect(clearTimeoutSpy).toHaveBeenCalled();
        clearTimeoutSpy.mockRestore();
        done();
      },
    });
  });
});

describe('TimeoutLink per call', () => {
  it('goes straight to forward when there is no deadline', () => {
    const forwarded = new Observable<FetchResult>(() => undefined);
    const forward = () => forwarded;
    const link = createTimeoutLink(0);
    const operation = { query: TEST_QUERY, getContext: () => ({}) } as never;

    expect(link.request(operation, forward)).toBe(forwarded);
  });

  it("takes the operation's own deadline over the link's", (done) => {
    jest.useFakeTimers();
    const link = ApolloLink.from([createRequestIdLink(), createTimeoutLink(0), createDelayedLink(1_000)]);

    execute(link, { query: TEST_QUERY, context: { timeoutMs: 50 } }).subscribe({
      error: (error) => {
        expect(error).toBeInstanceOf(TimeoutError);
        expect(error.timeoutMs).toBe(50);
        jest.useRealTimers();
        done();
      },
    });

    jest.advanceTimersByTime(60);
  });
});
