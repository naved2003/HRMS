/** Employee aggregate models. */

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export enum EmploymentType {
  FullTime = 'FullTime',
  PartTime = 'PartTime',
  Contract = 'Contract',
  Intern = 'Intern',
}

export enum EmployeeStatus {
  Active = 'Active',
  OnLeave = 'OnLeave',
  Terminated = 'Terminated',
  Resigned = 'Resigned',
}

export interface Employee {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender: Gender;
  address?: string;
  departmentId: string;
  departmentName?: string;
  designationId: string;
  designationName?: string;
  hireDate: string;
  employmentType: EmploymentType;
  basicSalary: number;
  status: EmployeeStatus;
  avatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface EmployeeInput {
  employeeCode: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender: Gender;
  address?: string;
  departmentId: string;
  designationId: string;
  hireDate: string;
  employmentType: EmploymentType;
  basicSalary: number;
  status: EmployeeStatus;
}

/** Light-weight row for list pages. */
export interface EmployeeListItem {
  id: string;
  employeeCode: string;
  fullName: string;
  email: string;
  phone?: string;
  departmentId: string;
  departmentName: string;
  designationId: string;
  designationName: string;
  status: EmployeeStatus;
  avatarUrl?: string;
}
