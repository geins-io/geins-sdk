import { ApolloLink, execute, gql, Observable } from '@apollo/client/core';
import { createIdempotencyLink } from '../../src/api-client/links/idempotencyLink';
import { REQUEST_HEADERS } from '../../src/constants/headerNames';

const TEST_QUERY = gql`
  query TestQuery {
    test
  }
`;

const TEST_MUTATION = gql`
  mutation TestMutation {
    doSomething
  }
`;

function createCapturingLink(onOperation: (op: any) => void): ApolloLink {
  return new ApolloLink((operation) => {
    onOperation(operation);
    return new Observable((observer) => {
      observer.next({ data: { test: true } });
      observer.complete();
    });
  });
}

describe('IdempotencyLink', () => {
  it('sets x-idempotency-key header on mutations', (done) => {
    const link = ApolloLink.from([
      createIdempotencyLink(),
      createCapturingLink((operation) => {
        const context = operation.getContext();
        expect(context.headers[REQUEST_HEADERS.IDEMPOTENCY_KEY]).toBeDefined();
        expect(typeof context.headers[REQUEST_HEADERS.IDEMPOTENCY_KEY]).toBe('string');
      }),
    ]);

    execute(link, { query: TEST_MUTATION }).subscribe({
      complete: done,
    });
  });

  it('does NOT set x-idempotency-key on queries', (done) => {
    const link = ApolloLink.from([
      createIdempotencyLink(),
      createCapturingLink((operation) => {
        const context = operation.getContext();
        expect(context.headers?.[REQUEST_HEADERS.IDEMPOTENCY_KEY]).toBeUndefined();
      }),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: done,
    });
  });

  it('generates UUID-format idempotency key', (done) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    const link = ApolloLink.from([
      createIdempotencyLink(),
      createCapturingLink((operation) => {
        const context = operation.getContext();
        expect(context.headers[REQUEST_HEADERS.IDEMPOTENCY_KEY]).toMatch(uuidRegex);
      }),
    ]);

    execute(link, { query: TEST_MUTATION }).subscribe({
      complete: done,
    });
  });

  it('generates unique keys per mutation', (done) => {
    const keys: string[] = [];

    const link = ApolloLink.from([
      createIdempotencyLink(),
      createCapturingLink((operation) => {
        const context = operation.getContext();
        if (context.headers[REQUEST_HEADERS.IDEMPOTENCY_KEY]) {
          keys.push(context.headers[REQUEST_HEADERS.IDEMPOTENCY_KEY]);
        }
      }),
    ]);

    execute(link, { query: TEST_MUTATION }).subscribe({
      complete: () => {
        execute(link, { query: TEST_MUTATION }).subscribe({
          complete: () => {
            expect(keys).toHaveLength(2);
            expect(keys[0]).not.toBe(keys[1]);
            done();
          },
        });
      },
    });
  });
});
