import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Ingredient, IngredientRequest } from '../models/ingredient.model';
import { LoggerService } from '../../../core/logging/logger-service';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  #http = inject(HttpClient);
  #logger = inject(LoggerService);

  baseUrl = 'http://localhost:8080/ingredient';

  getAll(): Observable<Ingredient[]> {
    return this.#http.get<Ingredient[]>(`${this.baseUrl}/all`).pipe(
      tap((ingredients) => this.#logger.debug(`Fetched ${ingredients.length} ingredients`))
    );
  }

  getById(id: number): Observable<Ingredient> {
    return this.#http.get<Ingredient>(`${this.baseUrl}?id=${id}`);
  }

  create(request: IngredientRequest): Observable<Ingredient> {
    return this.#http.post<Ingredient>(this.baseUrl, request);
  }

  update(id: number, request: IngredientRequest): Observable<Ingredient> {
    return this.#http.put<Ingredient>(`${this.baseUrl}?id=${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.baseUrl}?id=${id}`);
  }
}
