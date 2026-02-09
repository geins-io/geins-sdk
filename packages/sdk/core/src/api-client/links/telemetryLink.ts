import { ApolloLink, Operation, NextLink, FetchResult } from '@apollo/client/core';
import { Observable } from '@apollo/client/core';
import type { GeinsTelemetryConfig, GeinsTelemetrySnapshot } from '@geins/types';

/** Collects request metrics (counts, durations, p95) and periodically flushes them via the configured callback. */
export class TelemetryCollector {
  private _totalRequests = 0;
  private _successCount = 0;
  private _errorCount = 0;
  private _timeoutCount = 0;
  private _retryCount = 0;
  private _durations: number[] = [];
  private _timer: ReturnType<typeof setInterval> | null = null;
  private _onMetrics?: (snapshot: GeinsTelemetrySnapshot) => void;

  constructor(config: GeinsTelemetryConfig) {
    this._onMetrics = config.onMetrics;
    const flushIntervalMs = config.flushIntervalMs ?? 60000;
    if (this._onMetrics && flushIntervalMs > 0) {
      this._timer = setInterval(() => this.flush(), flushIntervalMs);
      if (typeof this._timer === 'object' && 'unref' in this._timer) {
        this._timer.unref();
      }
    }
  }

  recordSuccess(durationMs: number): void {
    this._totalRequests++;
    this._successCount++;
    this._durations.push(durationMs);
  }

  recordError(durationMs: number, isTimeout: boolean): void {
    this._totalRequests++;
    this._errorCount++;
    if (isTimeout) this._timeoutCount++;
    this._durations.push(durationMs);
  }

  recordRetry(): void {
    this._retryCount++;
  }

  snapshot(): GeinsTelemetrySnapshot {
    const sorted = [...this._durations].sort((a, b) => a - b);
    const avg = sorted.length > 0 ? sorted.reduce((a, b) => a + b, 0) / sorted.length : 0;
    const p95Index = Math.max(0, Math.ceil(sorted.length * 0.95) - 1);
    const p95 = sorted.length > 0 ? sorted[p95Index] : 0;

    return {
      totalRequests: this._totalRequests,
      successCount: this._successCount,
      errorCount: this._errorCount,
      timeoutCount: this._timeoutCount,
      retryCount: this._retryCount,
      avgDurationMs: Math.round(avg),
      p95DurationMs: p95,
    };
  }

  flush(): void {
    if (this._onMetrics) {
      this._onMetrics(this.snapshot());
    }
  }

  reset(): void {
    this._totalRequests = 0;
    this._successCount = 0;
    this._errorCount = 0;
    this._timeoutCount = 0;
    this._retryCount = 0;
    this._durations = [];
  }

  destroy(): void {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }
}

/** Creates an Apollo link that records success/error metrics into the given {@link TelemetryCollector}. */
export function createTelemetryLink(collector: TelemetryCollector): ApolloLink {
  return new ApolloLink((operation: Operation, forward: NextLink) => {
    return new Observable<FetchResult>((observer) => {
      const { requestStartTime } = operation.getContext();
      const startTime = requestStartTime || Date.now();

      const subscription = forward(operation).subscribe({
        next: (result) => {
          collector.recordSuccess(Date.now() - startTime);
          observer.next(result);
        },
        error: (error) => {
          const isTimeout = error?.name === 'TimeoutError';
          collector.recordError(Date.now() - startTime, isTimeout);
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
