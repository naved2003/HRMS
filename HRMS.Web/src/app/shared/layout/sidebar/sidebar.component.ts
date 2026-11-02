import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

/**
 * Sidebar — primary navigation for the HRMS shell. Each entry is a
 * Material list item with a Material icon and an active router highlight.
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { label: 'Departments', route: '/departments', icon: 'apartment' },
    { label: 'Designations', route: '/designations', icon: 'badge' },
    { label: 'Employees', route: '/employees', icon: 'people' },
    { label: 'Attendance', route: '/attendance', icon: 'event_available' },
    { label: 'Leave', route: '/leave', icon: 'beach_access' },
    { label: 'Payroll', route: '/payroll', icon: 'payments' },
    { label: 'Reports', route: '/reports', icon: 'assessment' },
  ];
}
