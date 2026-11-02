import { Injectable, signal } from '@angular/core';

/**
 * Global loading indicator. HTTP interceptors toggle this signal while
 * requests are in flight so a single top-of-page progress bar can react.
 *
 * Manual callers can also use `start()` / `stop()` for non-HTTP work.
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly _loading = signal(false);
  private readonly _pending = signal(0);

  readonly loading = this._loading.asReadonly();

  start(): void {
    this._pending.update((n) => n + 1);
    this._loading.set(true);
  }

  stop(): void {
    this._pending.update((n) => Math.max(0, n - 1));
    if (this._pending() === 0) {
      this._loading.set(false);
    }
  }

  reset(): void {
    this._pending.set(0);
    this._loading.set(false);
  }
}
