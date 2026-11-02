import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import { Attendance, AttendanceFilter, AttendanceInput } from '../models';

/** AttendanceRepository wraps /api/attendance/* endpoints. */
@Injectable({ providedIn: 'root' })
export class AttendanceRepository extends BaseRepository {
  mark(dto: AttendanceInput): Observable<Attendance> {
    return this.post<Attendance>('/attendance', dto);
  }

  update(id: string, dto: AttendanceInput): Observable<Attendance> {
    return this.put<Attendance>(`/attendance/${id}`, dto);
  }

  getByEmployee(employeeId: string, from?: string, to?: string): Observable<Attendance[]> {
    return this.list<Attendance>(`/attendance/employee/${employeeId}`, { from, to });
  }

  getByDate(date: string): Observable<Attendance[]> {
    return this.list<Attendance>('/attendance', { date });
  }

  getRange(from: string, to: string): Observable<Attendance[]> {
    return this.list<Attendance>('/attendance', { from, to });
  }

  queryByFilter(filter: AttendanceFilter): Observable<Attendance[]> {
    return this.list<Attendance>('/attendance', filter as Record<string, unknown>);
  }
}
