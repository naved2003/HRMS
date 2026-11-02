/** Designation aggregate models. */

export interface Designation {
  id: string;
  code: string;
  title: string;
  description?: string;
  departmentId: string;
  departmentName?: string;
  baseSalary?: number;
  employeeCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface DesignationInput {
  code: string;
  title: string;
  description?: string;
  departmentId: string;
  baseSalary?: number;
}
