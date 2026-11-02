import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import { DashboardStats } from '../models';

/** DashboardRepository wraps /api/dashboard/* endpoints. */
@Injectable({ providedIn: 'root' })
export class DashboardRepository extends BaseRepository {
  getStats(): Observable<DashboardStats> {
    return this.get<DashboardStats>('/dashboard/stats');
  }
}
