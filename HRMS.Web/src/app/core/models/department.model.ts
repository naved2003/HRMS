/** Department aggregate models. */

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  managerId?: string;
  managerName?: string;
  employeeCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface DepartmentInput {
  code: string;
  name: string;
  description?: string;
  managerId?: string;
}
