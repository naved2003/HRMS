import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

interface StatusStyle {
  color: string;
  background: string;
}

/** Map of status → color. */
const STATUS_PALETTE: Record<string, StatusStyle> = {
  // Generic
  active: { color: '#15803d', background: '#dcfce7' },
  inactive: { color: '#9333ea', background: '#ede9fe' },
  pending: { color: '#b45309', background: '#fef3c7' },
  approved: { color: '#15803d', background: '#dcfce7' },
  rejected: { color: '#b91c1c', background: '#fee2e2' },
  cancelled: { color: '#64748b', background: '#e2e8f0' },
  // Employee
  onleave: { color: '#0e7490', background: '#cffafe' },
  terminated: { color: '#b91c1c', background: '#fee2e2' },
  resigned: { color: '#64748b', background: '#e2e8f0' },
  // Attendance
  present: { color: '#15803d', background: '#dcfce7' },
  absent: { color: '#b91c1c', background: '#fee2e2' },
  halfday: { color: '#b45309', background: '#fef3c7' },
  workfromhome: { color: '#1d4ed8', background: '#dbeafe' },
  late: { color: '#ea580c', background: '#ffedd5' },
  holiday: { color: '#64748b', background: '#e2e8f0' },
  // Payroll
  draft: { color: '#64748b', background: '#e2e8f0' },
  processed: { color: '#1d4ed8', background: '#dbeafe' },
  paid: { color: '#15803d', background: '#dcfce7' },
  held: { color: '#b45309', background: '#fef3c7' },
};

const FALLBACK: StatusStyle = { color: '#475569', background: '#f1f5f9' };

/**
 * StatusChip — displays a coloured pill for a status string. Looks up
 * the status in STATUS_PALETTE and falls back to a neutral grey.
 */
@Component({
  selector: 'app-status-chip',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="status-chip"
      [style.color]="style().color"
      [style.background]="style().background"
    >
      {{ label() }}
    </span>
  `,
  styles: [
    `
      .status-chip {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.04em;
        white-space: nowrap;
      }
    `,
  ],
})
export class StatusChipComponent {
  readonly status = input<string>('');

  readonly label = computed(() => prettify(this.status()));
  readonly style = computed<StatusStyle>(() => {
    const key = (this.status() || '').toLowerCase().replace(/\s+/g, '');
    return STATUS_PALETTE[key] ?? FALLBACK;
  });
}

function prettify(status: string): string {
  if (!status) return '';
  return status
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
}
