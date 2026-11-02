import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import { LeaveTypeConfig, LeaveTypeInput } from '../models';

/** LeaveTypeRepository wraps /api/leave-types/* endpoints. */
@Injectable({ providedIn: 'root' })
export class LeaveTypeRepository extends BaseRepository {
  getAll(): Observable<LeaveTypeConfig[]> {
    return this.list<LeaveTypeConfig>('/leave-types');
  }

  create(dto: LeaveTypeInput): Observable<LeaveTypeConfig> {
    return this.post<LeaveTypeConfig>('/leave-types', dto);
  }

  update(id: string, dto: LeaveTypeInput): Observable<LeaveTypeConfig> {
    return this.put<LeaveTypeConfig>(`/leave-types/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.delete(`/leave-types/${id}`);
  }
}
