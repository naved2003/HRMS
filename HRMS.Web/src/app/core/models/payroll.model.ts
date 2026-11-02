/** Payroll aggregate models. */

export enum PayrollStatus {
  Draft = 'Draft',
  Processed = 'Processed',
  Paid = 'Paid',
  Held = 'Held',
  Cancelled = 'Cancelled',
}

export interface SalaryStructure {
  id: string;
  designationId: string;
  designationName?: string;
  basic: number;
  hra: number;
  conveyance: number;
  specialAllowance: number;
  medicalAllowance: number;
  pfDeduction: number;
  taxDeduction: number;
  otherDeduction: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface SalaryStructureInput {
  designationId: string;
  basic: number;
  hra: number;
  conveyance: number;
  specialAllowance: number;
  medicalAllowance: number;
  pfDeduction: number;
  taxDeduction: number;
  otherDeduction: number;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface PayslipComponent {
  name: string;
  amount: number;
  type: 'Earning' | 'Deduction';
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName?: string;
  designationName?: string;
  month: number;
  year: number;
  basic: number;
  gross: number;
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  status: PayrollStatus;
  processedAt?: string;
  paidAt?: string;
  components?: PayslipComponent[];
}

export interface Payslip extends PayrollRecord {
  bankAccount?: string;
  bankName?: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  paymentMode?: string;
}

export interface ProcessPayrollRequest {
  employeeId: string;
  month: number;
  year: number;
}

export interface ProcessBulkPayrollRequest {
  month: number;
  year: number;
  employeeIds?: string[];
}
