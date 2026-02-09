import { ApolloLink, execute, gql, Observable } from '@apollo/client/core';
import { createRequestIdLink } from '../../src/api-client/links/requestIdLink';
import { REQUEST_HEADERS } from '../../src/constants/headerNames';

const TEST_QUERY = gql`
  query TestQuery {
    test
  }
`;

function createTerminatingLink(onOperation: (op: any) => void): ApolloLink {
  return new ApolloLink((operation) => {
    onOperation(operation);
    return new Observable((observer) => {
      observer.next({ data: { test: true } });
      observer.complete();
    });
  });
}

describe('RequestIdLink', () => {
  it('sets x-request-id header on operation context', (done) => {
    const link = ApolloLink.from([
      createRequestIdLink(),
      createTerminatingLink((operation) => {
        const context = operation.getContext();
        expect(context.headers[REQUEST_HEADERS.REQUEST_ID]).toBeDefined();
        expect(typeof context.headers[REQUEST_HEADERS.REQUEST_ID]).toBe('string');
      }),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: done,
    });
  });

  it('generates a UUID-format request ID', (done) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const link = ApolloLink.from([
      createRequestIdLink(),
      createTerminatingLink((operation) => {
        const context = operation.getContext();
        expect(context.headers[REQUEST_HEADERS.REQUEST_ID]).toMatch(uuidRegex);
      }),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: done,
    });
  });

  it('sets requestId on operation context', (done) => {
    const link = ApolloLink.from([
      createRequestIdLink(),
      createTerminatingLink((operation) => {
        const context = operation.getContext();
        expect(context.requestId).toBeDefined();
        expect(context.requestId).toBe(context.headers[REQUEST_HEADERS.REQUEST_ID]);
      }),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: done,
    });
  });

  it('sets requestStartTime on operation context', (done) => {
    const before = Date.now();

    const link = ApolloLink.from([
      createRequestIdLink(),
      createTerminatingLink((operation) => {
        const context = operation.getContext();
        expect(context.requestStartTime).toBeGreaterThanOrEqual(before);
        expect(context.requestStartTime).toBeLessThanOrEqual(Date.now());
      }),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: done,
    });
  });

  it('generates unique IDs for each request', (done) => {
    const ids: string[] = [];

    const link = ApolloLink.from([
      createRequestIdLink(),
      createTerminatingLink((operation) => {
        const context = operation.getContext();
        ids.push(context.requestId);
      }),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: () => {
        execute(link, { query: TEST_QUERY }).subscribe({
          complete: () => {
            expect(ids).toHaveLength(2);
            expect(ids[0]).not.toBe(ids[1]);
            done();
          },
        });
      },
    });
  });

  it('sets x-sdk-version header', (done) => {
    const link = ApolloLink.from([
      createRequestIdLink(),
      createTerminatingLink((operation) => {
        const context = operation.getContext();
        expect(context.headers[REQUEST_HEADERS.SDK_VERSION]).toBeDefined();
        expect(context.headers[REQUEST_HEADERS.SDK_VERSION]).toMatch(/^\d+\.\d+\.\d+/);
      }),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: done,
    });
  });

  it('preserves existing headers', (done) => {
    const link = ApolloLink.from([
      createRequestIdLink(),
      createTerminatingLink((operation) => {
        const context = operation.getContext();
        expect(context.headers['x-existing']).toBe('value');
        expect(context.headers[REQUEST_HEADERS.REQUEST_ID]).toBeDefined();
      }),
    ]);

    execute(link, {
      query: TEST_QUERY,
      context: { headers: { 'x-existing': 'value' } },
    }).subscribe({
      complete: done,
    });
  });
});
