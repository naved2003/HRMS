import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import { Employee, EmployeeInput, EmployeeListItem } from '../models';

/** EmployeeRepository wraps /api/employees/* endpoints. */
@Injectable({ providedIn: 'root' })
export class EmployeeRepository extends BaseRepository {
  getAll(): Observable<EmployeeListItem[]> {
    return this.list<EmployeeListItem>('/employees');
  }

  getById(id: string): Observable<Employee> {
    return this.get<Employee>(`/employees/${id}`);
  }

  getWithDetails(id: string): Observable<Employee> {
    return this.get<Employee>(`/employees/${id}/details`);
  }

  getByDepartment(departmentId: string): Observable<EmployeeListItem[]> {
    return this.list<EmployeeListItem>('/employees', { departmentId });
  }

  create(dto: EmployeeInput): Observable<Employee> {
    return this.post<Employee>('/employees', dto);
  }

  update(id: string, dto: EmployeeInput): Observable<Employee> {
    return this.put<Employee>(`/employees/${id}`, dto);
  }

  override delete(id: string): Observable<void> {
    return super.delete(`/employees/${id}`);
  }
}
