/** Dashboard aggregate models. */

export interface DepartmentWiseCount {
  department: string;
  count: number;
}

export interface AttendanceTrendPoint {
  /** ISO date string (yyyy-MM-dd). */
  date: string;
  present: number;
  absent: number;
  onLeave: number;
}

export interface LeaveStatusBreakdown {
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
}

export interface DashboardStats {
  totalEmployees: number;
  totalDepartments: number;
  presentToday: number;
  absentToday: number;
  onLeaveToday: number;
  pendingLeaveRequests: number;
  processedPayrollsThisMonth: number;
  departmentWiseCount: DepartmentWiseCount[];
  attendanceTrend: AttendanceTrendPoint[];
  leaveStatusBreakdown?: LeaveStatusBreakdown;
}
