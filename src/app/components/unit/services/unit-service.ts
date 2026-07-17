import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Unit, UnitRequest } from '../models/unit.model';
import { LoggerService } from '../../../core/logging/logger-service';

@Injectable({
  providedIn: 'root',
})
export class UnitService {
  #http = inject(HttpClient);
  #logger = inject(LoggerService);

  baseUrl = 'http://localhost:8080/unit';

  getAll(): Observable<Unit[]> {
    return this.#http.get<Unit[]>(`${this.baseUrl}/all`).pipe(
      tap((units) => this.#logger.debug(`Fetched ${units.length} units`))
    );
  }

  getById(id: number): Observable<Unit> {
    return this.#http.get<Unit>(`${this.baseUrl}?id=${id}`);
  }

  create(request: UnitRequest): Observable<Unit> {
    return this.#http.post<Unit>(this.baseUrl, request);
  }

  update(id: number, request: UnitRequest): Observable<Unit> {
    return this.#http.put<Unit>(`${this.baseUrl}?id=${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.baseUrl}?id=${id}`);
  }
}
