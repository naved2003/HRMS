import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BaseChartDirective } from 'ng2-charts';
// chart.js v4 is tree-shakable — without this auto-import, the controllers,
// elements, scales, and plugins are not registered and <canvas baseChart>
// renders nothing (blank chart area). The '/auto' entry point registers
// everything globally. Side-effect import — no symbols needed.
import 'chart.js/auto';
import {
  ChartConfiguration,
  ChartOptions,
} from 'chart.js';

import { DashboardService } from '../../core/services/dashboard.service';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

interface KpiCard {
  label: string;
  value: number;
  icon: string;
}

/**
 * DashboardComponent — landing page shown after login.
 *
 * Renders 6 KPI cards (employees, attendance, leaves, departments, payroll),
 * a pie chart of department-wise headcount distribution, a bar chart of the
 * last 7 days of attendance (present/absent/on-leave stacked), and a doughnut
 * chart for the leave-status breakdown.
 */
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DecimalPipe,
    BaseChartDirective,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatProgressBarModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  readonly dashboardService = inject(DashboardService);

  readonly stats = this.dashboardService.stats;
  readonly loading = this.dashboardService.loading;
  readonly error = this.dashboardService.error;

  readonly kpis = computed<KpiCard[]>(() => {
    const s = this.stats();
    if (!s) return [];
    return [
      { label: 'Total Employees', value: s.totalEmployees, icon: 'groups' },
      { label: 'Present Today', value: s.presentToday, icon: 'event_available' },
      { label: 'On Leave Today', value: s.onLeaveToday, icon: 'beach_access' },
      { label: 'Pending Leaves', value: s.pendingLeaveRequests, icon: 'pending_actions' },
      { label: 'Departments', value: s.totalDepartments, icon: 'apartment' },
      { label: 'Payroll (This Month)', value: s.processedPayrollsThisMonth, icon: 'payments' },
    ];
  });

  // ---------- Pie chart: Department-wise headcount ----------
  readonly pieChartData: ChartConfiguration<'pie'>['data'] = {
    labels: [],
    datasets: [{ data: [], backgroundColor: [] }],
  };

  readonly pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      tooltip: { enabled: true },
    },
  };

  readonly pieChartType = 'pie' as const;

  // ---------- Bar chart: Attendance trend (last 7 days) ----------
  readonly barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { label: 'Present', data: [], backgroundColor: '#16a34a' },
      { label: 'Absent', data: [], backgroundColor: '#dc2626' },
      { label: 'On Leave', data: [], backgroundColor: '#f59e0b' },
    ],
  };

  readonly barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true, ticks: { precision: 0 } },
    },
    plugins: {
      legend: { position: 'top' },
    },
  };

  readonly barChartType = 'bar' as const;

  // ---------- Doughnut chart: Leave status breakdown ----------
  readonly doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    datasets: [{ data: [0, 0, 0, 0], backgroundColor: ['#f59e0b', '#16a34a', '#dc2626', '#6b7280'] }],
  };

  readonly doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
    },
  };

  readonly doughnutChartType = 'doughnut' as const;

  // Derived chart data (re-computed whenever stats() changes)
  readonly pieData = computed<ChartConfiguration<'pie'>['data']>(() => {
    const s = this.stats();
    if (!s || !s.departmentWiseCount?.length) {
      return { labels: ['No data'], datasets: [{ data: [1], backgroundColor: ['#e5e7eb'] }] };
    }
    const palette = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#9333ea', '#0891b2', '#ea580c', '#65a30d'];
    return {
      labels: s.departmentWiseCount.map(d => d.department),
      datasets: [{
        data: s.departmentWiseCount.map(d => d.count),
        backgroundColor: s.departmentWiseCount.map((_, i) => palette[i % palette.length]),
      }],
    };
  });

  readonly barData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const s = this.stats();
    if (!s || !s.attendanceTrend?.length) {
      return { labels: [], datasets: [] };
    }
    return {
      labels: s.attendanceTrend.map(t => t.date.slice(5)),
      datasets: [
        { label: 'Present', data: s.attendanceTrend.map(t => t.present), backgroundColor: '#16a34a' },
        { label: 'Absent', data: s.attendanceTrend.map(t => t.absent), backgroundColor: '#dc2626' },
        { label: 'On Leave', data: s.attendanceTrend.map(t => t.onLeave), backgroundColor: '#f59e0b' },
      ],
    };
  });

  readonly doughnutData = computed<ChartConfiguration<'doughnut'>['data']>(() => {
    const b = this.stats()?.leaveStatusBreakdown;
    return {
      labels: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
      datasets: [{
        data: [b?.pending ?? 0, b?.approved ?? 0, b?.rejected ?? 0, b?.cancelled ?? 0],
        backgroundColor: ['#f59e0b', '#16a34a', '#dc2626', '#6b7280'],
      }],
    };
  });

  ngOnInit(): void {
    if (!this.dashboardService.hasData()) {
      this.dashboardService.load();
    }
  }

  trackByValue(_: number, item: KpiCard): string {
    return item.label;
  }
}
