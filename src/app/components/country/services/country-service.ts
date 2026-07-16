import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Country, CountryRequest } from '../models/country.model';
import { LoggerService } from '../../../core/logging/logger-service';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  #http = inject(HttpClient);
  #logger = inject(LoggerService);

  baseUrl = 'http://localhost:8080/country';

  getAll(): Observable<Country[]> {
    return this.#http.get<Country[]>(`${this.baseUrl}/all`).pipe(
      tap((countries) => this.#logger.debug(`Fetched ${countries.length} countries`))
    );
  }

  getById(id: number): Observable<Country> {
    return this.#http.get<Country>(`${this.baseUrl}?id=${id}`);
  }

  create(request: CountryRequest): Observable<Country> {
    return this.#http.post<Country>(this.baseUrl, request);
  }

  update(id: number, request: CountryRequest): Observable<Country> {
    return this.#http.put<Country>(`${this.baseUrl}?id=${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.baseUrl}?id=${id}`);
  }
}
