/** Auth-related models for HRMS.Web. */

export enum UserRole {
  Admin = 'Admin',
  HR = 'HR',
  Manager = 'Manager',
  Employee = 'Employee',
}

export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  userName: string;
  fullName: string;
  roles: UserRole[];
  employeeId?: string;
  avatarUrl?: string;
}

/** Payload returned by POST /api/auth/login (cookie set by server). */
export interface LoginResponse {
  user: AuthUser;
  expiresAt?: string;
}
