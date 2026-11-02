import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import { Designation, DesignationInput } from '../models';

/** DesignationRepository wraps /api/designations/* endpoints. */
@Injectable({ providedIn: 'root' })
export class DesignationRepository extends BaseRepository {
  getAll(): Observable<Designation[]> {
    return this.list<Designation>('/designations');
  }

  getByDepartment(departmentId: string): Observable<Designation[]> {
    return this.list<Designation>('/designations', { departmentId });
  }

  getById(id: string): Observable<Designation> {
    return this.get<Designation>(`/designations/${id}`);
  }

  create(dto: DesignationInput): Observable<Designation> {
    return this.post<Designation>('/designations', dto);
  }

  update(id: string, dto: DesignationInput): Observable<Designation> {
    return this.put<Designation>(`/designations/${id}`, dto);
  }

  override delete(id: string): Observable<void> {
    return super.delete(`/designations/${id}`);
  }
}
