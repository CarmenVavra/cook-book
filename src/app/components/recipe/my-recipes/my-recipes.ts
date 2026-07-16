import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoggerService } from '../../../core/logging/logger-service';
import { RecipeSummary } from '../models/recipe.model';
import { RecipeService } from '../services/recipe-service';

@Component({
  selector: 'app-my-recipes',
  imports: [AsyncPipe, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './my-recipes.html',
  styleUrl: './my-recipes.css',
})
export class MyRecipes {
  readonly recipes = signal<RecipeSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  protected auth: AuthService | null = isPlatformBrowser(inject(PLATFORM_ID)) ? inject(AuthService) : null;
  #currentUser = toSignal(this.auth?.user$ ?? of(null), { initialValue: null });

  readonly myRecipes = computed(() => {
    const sub = this.#currentUser()?.sub;
    if (!sub) return [];
    return this.recipes().filter((recipe) => recipe.ownerSub === sub);
  });

  #recipeService = inject(RecipeService);
  #logger = inject(LoggerService);
  #destroyRef = inject(DestroyRef);

  constructor() {
    this.load();
  }

  reload(): void {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(false);

    this.#recipeService.getAll()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (recipes) => {
          this.recipes.set(recipes);
          this.loading.set(false);
        },
        error: (error) => {
          this.#logger.error('Failed to load recipes for the my-recipes page', error);
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
