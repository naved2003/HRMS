/** Leave Type configuration (admin-managed). */

export interface LeaveTypeConfig {
  id: string;
  type: string;
  label: string;
  defaultAllocation: number;
  carryForward: boolean;
  isPaid: boolean;
}

export interface LeaveTypeInput {
  type: string;
  label: string;
  defaultAllocation: number;
  carryForward: boolean;
  isPaid: boolean;
}
