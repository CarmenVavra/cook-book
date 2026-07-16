import { Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoggerService } from '../../../core/logging/logger-service';
import { RecipeSummary } from '../models/recipe.model';
import { RecipeService } from '../services/recipe-service';

@Component({
  selector: 'app-recipe-list',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.css',
})
export class RecipeList {
  readonly typeId = input.required<string>();
  readonly categoryId = input.required<string>();

  readonly recipes = signal<RecipeSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly categoryName = computed(() => {
    const catId = Number(this.categoryId());
    for (const recipe of this.recipes()) {
      const match = recipe.categories.find((category) => category.id === catId);
      if (match) return match.name;
    }
    return '';
  });

  #recipeService = inject(RecipeService);
  #logger = inject(LoggerService);
  #destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.load(Number(this.typeId()), Number(this.categoryId()));
    });
  }

  reload(): void {
    this.load(Number(this.typeId()), Number(this.categoryId()));
  }

  private load(typeId: number, categoryId: number): void {
    this.loading.set(true);
    this.error.set(false);

    this.#recipeService.getAll(typeId, categoryId)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (recipes) => {
          this.recipes.set(recipes);
          this.loading.set(false);
        },
        error: (error) => {
          this.#logger.error('Failed to load recipes for recipe browsing', error);
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
