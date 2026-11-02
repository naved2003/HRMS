import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import { Department, DepartmentInput } from '../models';

/** DepartmentRepository wraps /api/departments/* endpoints. */
@Injectable({ providedIn: 'root' })
export class DepartmentRepository extends BaseRepository {
  getAll(): Observable<Department[]> {
    return this.list<Department>('/departments');
  }

  getById(id: string): Observable<Department> {
    return this.get<Department>(`/departments/${id}`);
  }

  create(dto: DepartmentInput): Observable<Department> {
    return this.post<Department>('/departments', dto);
  }

  update(id: string, dto: DepartmentInput): Observable<Department> {
    return this.put<Department>(`/departments/${id}`, dto);
  }

  override delete(id: string): Observable<void> {
    return super.delete(`/departments/${id}`);
  }
}
