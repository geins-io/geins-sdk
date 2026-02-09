import { ApolloLink, execute, gql, Observable } from '@apollo/client/core';
import { createTelemetryLink, TelemetryCollector } from '../../src/api-client/links/telemetryLink';
import { createRequestIdLink } from '../../src/api-client/links/requestIdLink';

const TEST_QUERY = gql`
  query TestQuery {
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
      observer.error(new Error('fail'));
    });
  });
}

function createTimeoutErrorLink(): ApolloLink {
  return new ApolloLink(() => {
    return new Observable((observer) => {
      const err = new Error('timeout');
      err.name = 'TimeoutError';
      observer.error(err);
    });
  });
}

describe('TelemetryCollector', () => {
  it('starts with zero counts', () => {
    const collector = new TelemetryCollector({});
    const snap = collector.snapshot();
    expect(snap.totalRequests).toBe(0);
    expect(snap.successCount).toBe(0);
    expect(snap.errorCount).toBe(0);
    expect(snap.timeoutCount).toBe(0);
    expect(snap.retryCount).toBe(0);
    expect(snap.avgDurationMs).toBe(0);
    expect(snap.p95DurationMs).toBe(0);
  });

  it('records successes', () => {
    const collector = new TelemetryCollector({});
    collector.recordSuccess(100);
    collector.recordSuccess(200);
    const snap = collector.snapshot();
    expect(snap.totalRequests).toBe(2);
    expect(snap.successCount).toBe(2);
    expect(snap.avgDurationMs).toBe(150);
  });

  it('records errors and timeouts separately', () => {
    const collector = new TelemetryCollector({});
    collector.recordError(50, false);
    collector.recordError(75, true);
    const snap = collector.snapshot();
    expect(snap.totalRequests).toBe(2);
    expect(snap.errorCount).toBe(2);
    expect(snap.timeoutCount).toBe(1);
  });

  it('calculates p95 correctly', () => {
    const collector = new TelemetryCollector({});
    for (let i = 1; i <= 100; i++) {
      collector.recordSuccess(i);
    }
    const snap = collector.snapshot();
    expect(snap.p95DurationMs).toBe(95);
  });

  it('resets all counters', () => {
    const collector = new TelemetryCollector({});
    collector.recordSuccess(100);
    collector.recordError(50, true);
    collector.reset();
    const snap = collector.snapshot();
    expect(snap.totalRequests).toBe(0);
    expect(snap.successCount).toBe(0);
    expect(snap.errorCount).toBe(0);
  });

  it('calls onMetrics callback on flush', () => {
    const onMetrics = jest.fn();
    const collector = new TelemetryCollector({ onMetrics });
    collector.recordSuccess(100);
    collector.flush();
    expect(onMetrics).toHaveBeenCalledTimes(1);
    expect(onMetrics.mock.calls[0][0].totalRequests).toBe(1);
    collector.destroy();
  });

  it('auto-flushes on interval', (done) => {
    const onMetrics = jest.fn();
    const collector = new TelemetryCollector({ onMetrics, flushIntervalMs: 50 });
    collector.recordSuccess(100);

    setTimeout(() => {
      expect(onMetrics).toHaveBeenCalled();
      collector.destroy();
      done();
    }, 150);
  });
});

describe('TelemetryLink', () => {
  it('records success via link', (done) => {
    const collector = new TelemetryCollector({});

    const link = ApolloLink.from([
      createRequestIdLink(),
      createTelemetryLink(collector),
      createSuccessLink(),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      complete: () => {
        const snap = collector.snapshot();
        expect(snap.totalRequests).toBe(1);
        expect(snap.successCount).toBe(1);
        expect(snap.errorCount).toBe(0);
        done();
      },
    });
  });

  it('records error via link', (done) => {
    const collector = new TelemetryCollector({});

    const link = ApolloLink.from([
      createRequestIdLink(),
      createTelemetryLink(collector),
      createErrorLink(),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      error: () => {
        const snap = collector.snapshot();
        expect(snap.totalRequests).toBe(1);
        expect(snap.errorCount).toBe(1);
        expect(snap.timeoutCount).toBe(0);
        done();
      },
    });
  });

  it('records timeout error as timeout', (done) => {
    const collector = new TelemetryCollector({});

    const link = ApolloLink.from([
      createRequestIdLink(),
      createTelemetryLink(collector),
      createTimeoutErrorLink(),
    ]);

    execute(link, { query: TEST_QUERY }).subscribe({
      error: () => {
        const snap = collector.snapshot();
        expect(snap.timeoutCount).toBe(1);
        done();
      },
    });
  });
});
