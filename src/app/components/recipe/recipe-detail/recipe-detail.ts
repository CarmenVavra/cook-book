import { Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoggerService } from '../../../core/logging/logger-service';
import { RecipeDetail as RecipeDetailModel } from '../models/recipe.model';
import { RecipeService } from '../services/recipe-service';

@Component({
  selector: 'app-recipe-detail',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail {
  readonly id = input.required<string>();

  readonly recipe = signal<RecipeDetailModel | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  #recipeService = inject(RecipeService);
  #logger = inject(LoggerService);
  #destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.load(Number(this.id()));
    });
  }

  reload(): void {
    this.load(Number(this.id()));
  }

  private load(id: number): void {
    this.loading.set(true);
    this.error.set(false);

    this.#recipeService.getById(id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (recipe) => {
          this.recipe.set(recipe);
          this.loading.set(false);
        },
        error: (error) => {
          this.#logger.error('Failed to load recipe detail', error);
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
