import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository } from './base.repository';
import { SalaryStructure, SalaryStructureInput } from '../models';

/** SalaryStructureRepository wraps /api/salary-structures/* endpoints. */
@Injectable({ providedIn: 'root' })
export class SalaryStructureRepository extends BaseRepository {
  getAll(): Observable<SalaryStructure[]> {
    return this.list<SalaryStructure>('/salary-structures');
  }

  create(dto: SalaryStructureInput): Observable<SalaryStructure> {
    return this.post<SalaryStructure>('/salary-structures', dto);
  }

  update(id: string, dto: SalaryStructureInput): Observable<SalaryStructure> {
    return this.put<SalaryStructure>(`/salary-structures/${id}`, dto);
  }
}
