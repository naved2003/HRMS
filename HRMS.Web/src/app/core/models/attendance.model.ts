/** Attendance aggregate models. */

export enum AttendanceStatus {
  Present = 'Present',
  Absent = 'Absent',
  HalfDay = 'HalfDay',
  WorkFromHome = 'WorkFromHome',
  Late = 'Late',
  Holiday = 'Holiday',
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  departmentName?: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  workedHours?: number;
  remarks?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AttendanceInput {
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: AttendanceStatus;
  remarks?: string;
}

export interface AttendanceFilter {
  date?: string;
  departmentId?: string;
  employeeId?: string;
  from?: string;
  to?: string;
  status?: AttendanceStatus;
}
