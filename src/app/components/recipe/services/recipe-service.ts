import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { RecipeDetail, RecipeRequest, RecipeSummary } from '../models/recipe.model';
import { LoggerService } from '../../../core/logging/logger-service';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  #http = inject(HttpClient);
  #logger = inject(LoggerService);

  baseUrl = 'http://localhost:8080/recipe';

  getAll(typeId?: number, categoryId?: number): Observable<RecipeSummary[]> {
    let params = new HttpParams();
    if (typeId != null) {
      params = params.set('typeId', typeId);
    }
    if (categoryId != null) {
      params = params.set('categoryId', categoryId);
    }

    return this.#http.get<RecipeSummary[]>(`${this.baseUrl}/all`, { params }).pipe(
      tap((recipes) => this.#logger.debug(`Fetched ${recipes.length} recipes`))
    );
  }

  getById(id: number): Observable<RecipeDetail> {
    return this.#http.get<RecipeDetail>(`${this.baseUrl}?id=${id}`);
  }

  create(request: RecipeRequest): Observable<RecipeDetail> {
    return this.#http.post<RecipeDetail>(this.baseUrl, request);
  }

  delete(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.baseUrl}?id=${id}`);
  }
}
