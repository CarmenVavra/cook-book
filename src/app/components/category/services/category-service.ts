import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Category, CategoryRequest } from '../models/category.model';
import { LoggerService } from '../../../core/logging/logger-service';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  #http = inject(HttpClient);
  #logger = inject(LoggerService);

  baseUrl = 'http://localhost:8080/category';

  getAll(): Observable<Category[]> {
    return this.#http.get<Category[]>(`${this.baseUrl}/all`).pipe(
      tap((categories) => this.#logger.debug(`Fetched ${categories.length} categories`))
    );
  }

  getById(id: number): Observable<Category> {
    return this.#http.get<Category>(`${this.baseUrl}?id=${id}`);
  }

  create(request: CategoryRequest): Observable<Category> {
    return this.#http.post<Category>(this.baseUrl, request);
  }

  update(id: number, request: CategoryRequest): Observable<Category> {
    return this.#http.put<Category>(`${this.baseUrl}?id=${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.baseUrl}?id=${id}`);
  }
}
