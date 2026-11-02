import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../core/services/loading.service';

/**
 * LoadingSpinner — overlays a centered Material progress spinner while
 * HTTP requests are in flight. Wires to the global LoadingService so
 * a single indicator handles every active request.
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading.loading()) {
      <div class="overlay">
        <mat-progress-spinner
          mode="indeterminate"
          diameter="48"
          color="primary"
        />
      </div>
    }
  `,
  styles: [
    `
      .overlay {
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.18);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
    `,
  ],
})
export class LoadingSpinnerComponent {
  public readonly loading = inject(LoadingService);
}
