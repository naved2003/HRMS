import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ShellLayoutComponent } from './shared/layout/shell-layout/shell-layout.component';

/**
 * Route table for HRMS.Web.
 *
 * Standalone lazy loading pattern: every feature component is loaded via
 * `loadComponent` so the initial bundle stays small. Authenticated routes
 * share a single ShellLayout wrapper which renders the sidebar + topbar.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
    title: 'HRMS — Login',
  },
  {
    path: '',
    canActivate: [authGuard],
    component: ShellLayoutComponent,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
        title: 'HRMS — Dashboard',
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./features/departments/department-list.component').then(
            (m) => m.DepartmentListComponent
          ),
        title: 'HRMS — Departments',
      },
      {
        path: 'designations',
        loadComponent: () =>
          import('./features/designations/designation-list.component').then(
            (m) => m.DesignationListComponent
          ),
        title: 'HRMS — Designations',
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./features/employees/employee-list/employee-list.component').then(
            (m) => m.EmployeeListComponent
          ),
        title: 'HRMS — Employees',
      },
      {
        path: 'employees/:id',
        loadComponent: () =>
          import('./features/employees/employee-detail/employee-detail.component').then(
            (m) => m.EmployeeDetailComponent
          ),
        title: 'HRMS — Employee Profile',
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./features/attendance/attendance.component').then(
            (m) => m.AttendanceComponent
          ),
        title: 'HRMS — Attendance',
      },
      {
        path: 'leave',
        loadComponent: () =>
          import('./features/leave/leave-list.component').then(
            (m) => m.LeaveListComponent
          ),
        title: 'HRMS — Leave',
      },
      {
        path: 'payroll',
        loadComponent: () =>
          import('./features/payroll/payroll-list.component').then(
            (m) => m.PayrollListComponent
          ),
        title: 'HRMS — Payroll',
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/reports/reports.component').then(
            (m) => m.ReportsComponent
          ),
        title: 'HRMS — Reports',
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
