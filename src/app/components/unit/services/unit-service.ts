import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Unit } from '../models/unit.model';
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
}
