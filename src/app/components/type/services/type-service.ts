import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Type, TypeRequest } from '../models/type.model';
import { LoggerService } from '../../../core/logging/logger-service';

@Injectable({
  providedIn: 'root',
})
export class TypeService {
  #http = inject(HttpClient);
  #logger = inject(LoggerService);

  baseUrl = 'http://localhost:8080/type';

  getAll(): Observable<Type[]> {
    return this.#http.get<Type[]>(`${this.baseUrl}/all`).pipe(
      tap((types) => this.#logger.debug(`Fetched ${types.length} types`))
    );
  }

  getById(id: number): Observable<Type> {
    return this.#http.get<Type>(`${this.baseUrl}?id=${id}`);
  }

  create(request: TypeRequest): Observable<Type> {
    return this.#http.post<Type>(this.baseUrl, request);
  }

  update(id: number, request: TypeRequest): Observable<Type> {
    return this.#http.put<Type>(`${this.baseUrl}?id=${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.baseUrl}?id=${id}`);
  }
}
