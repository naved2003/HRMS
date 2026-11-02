import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import { LeaveApproval, LeaveRequest, LeaveRequestInput } from '../models';

/** LeaveRepository wraps /api/leave/* endpoints. */
@Injectable({ providedIn: 'root' })
export class LeaveRepository extends BaseRepository {
  apply(dto: LeaveRequestInput): Observable<LeaveRequest> {
    return this.post<LeaveRequest>('/leave', dto);
  }

  approve(id: string, dto: LeaveApproval): Observable<LeaveRequest> {
    return this.post<LeaveRequest>(`/leave/${id}/approve`, dto);
  }

  reject(id: string, dto: LeaveApproval): Observable<LeaveRequest> {
    return this.post<LeaveRequest>(`/leave/${id}/reject`, dto);
  }

  cancel(id: string): Observable<void> {
    return this.postVoid(`/leave/${id}/cancel`, {});
  }

  getPending(): Observable<LeaveRequest[]> {
    return this.list<LeaveRequest>('/leave', { status: 'Pending' });
  }

  getByEmployee(employeeId: string): Observable<LeaveRequest[]> {
    return this.list<LeaveRequest>(`/leave/employee/${employeeId}`);
  }

  getAll(filter?: Record<string, unknown>): Observable<LeaveRequest[]> {
    return this.list<LeaveRequest>('/leave', filter);
  }

  getMine(): Observable<LeaveRequest[]> {
    return this.list<LeaveRequest>('/leave/mine');
  }
}
