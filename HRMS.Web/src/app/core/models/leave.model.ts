/** Leave aggregate models. */

export enum LeaveType {
  Casual = 'Casual',
  Sick = 'Sick',
  Earned = 'Earned',
  Maternity = 'Maternity',
  Paternity = 'Paternity',
  Unpaid = 'Unpaid',
}

export enum LeaveStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Cancelled = 'Cancelled',
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  days: number;
  reason?: string;
  status: LeaveStatus;
  approverId?: string;
  approverName?: string;
  approvalRemarks?: string;
  appliedAt: string;
  decidedAt?: string;
}

export interface LeaveRequestInput {
  employeeId: string;
  leaveType: LeaveType;
  fromDate: string;
  toDate: string;
  reason?: string;
}

export interface LeaveApproval {
  remarks?: string;
}
