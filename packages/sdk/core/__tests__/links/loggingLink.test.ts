import { ApolloLink, execute, gql, Observable } from '@apollo/client/core';
import { createLoggingLink } from '../../src/api-client/links/loggingLink';
import { createRequestIdLink } from '../../src/api-client/links/requestIdLink';
import { Logger } from '../../src/utils/logger';
import { GeinsLogLevel } from '@geins/types';

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

describe('LoggingLink', () => {
  it('logs debug on request start and success', (done) => {
    const logger = new Logger(GeinsLogLevel.DEBUG);
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation();

    const link = ApolloLink.from([
      createRequestIdLink(),
      createLoggingLink(logger),
      createSuccessLink(),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: () => {
        expect(debugSpy).toHaveBeenCalledTimes(2);
        expect(debugSpy.mock.calls[0][0]).toContain('Starting TestOp');
        expect(debugSpy.mock.calls[1][0]).toContain('TestOp completed in');
        debugSpy.mockRestore();
        done();
      },
    });
  });

  it('logs error on failure', (done) => {
    const logger = new Logger(GeinsLogLevel.DEBUG);
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    const link = ApolloLink.from([
      createRequestIdLink(),
      createLoggingLink(logger),
      createErrorLink(),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      error: () => {
        expect(debugSpy).toHaveBeenCalledTimes(1);
        expect(debugSpy.mock.calls[0][0]).toContain('Starting TestOp');
        expect(errorSpy).toHaveBeenCalledTimes(1);
        expect(errorSpy.mock.calls[0][0]).toContain('TestOp failed after');
        expect(errorSpy.mock.calls[0][0]).toContain('server error');
        debugSpy.mockRestore();
        errorSpy.mockRestore();
        done();
      },
    });
  });

  it('does not log when logLevel is NONE', (done) => {
    const logger = new Logger(GeinsLogLevel.NONE);
    const debugSpy = jest.spyOn(console, 'debug').mockImplementation();
    const errorSpy = jest.spyOn(console, 'error').mockImplementation();

    const link = ApolloLink.from([
      createRequestIdLink(),
      createLoggingLink(logger),
      createSuccessLink(),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: () => {
        expect(debugSpy).not.toHaveBeenCalled();
        expect(errorSpy).not.toHaveBeenCalled();
        debugSpy.mockRestore();
        errorSpy.mockRestore();
        done();
      },
    });
  });
});
