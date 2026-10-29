import { Component, DestroyRef, computed, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoggerService } from '../../../core/logging/logger-service';
import { CategoryRef, RecipeSummary } from '../models/recipe.model';
import { RecipeService } from '../services/recipe-service';

@Component({
  selector: 'app-recipe-categories',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './recipe-categories.html',
  styleUrl: './recipe-categories.css',
})
export class RecipeCategories {
  readonly typeId = input.required<string>();

  readonly recipes = signal<RecipeSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly typeName = computed(() => this.recipes()[0]?.typeName ?? '');

  readonly categories = computed(() => {
    const seen = new Map<number, CategoryRef>();
    for (const recipe of this.recipes()) {
      for (const category of recipe.categories) {
        seen.set(category.id, category);
      }
    }
    return Array.from(seen.values()).sort((a, b) => a.name.localeCompare(b.name));
  });

  #recipeService = inject(RecipeService);
  #logger = inject(LoggerService);
  #destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      this.load(Number(this.typeId()));
    });
  }

  reload(): void {
    this.load(Number(this.typeId()));
  }

  private load(typeId: number): void {
    this.loading.set(true);
    this.error.set(false);

    this.#recipeService.getAll(typeId)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (recipes) => {
          this.recipes.set(recipes);
          this.loading.set(false);
        },
        error: (error) => {
          this.#logger.error('Failed to load categories for recipe browsing', error);
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
