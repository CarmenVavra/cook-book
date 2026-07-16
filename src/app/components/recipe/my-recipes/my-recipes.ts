import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { forkJoin, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoggerService } from '../../../core/logging/logger-service';
import { RecipeRequest, RecipeSummary } from '../models/recipe.model';
import { RecipeService } from '../services/recipe-service';
import { RecipeForm } from '../recipe-form/recipe-form';
import { CountryService } from '../../country/services/country-service';
import { TypeService } from '../../type/services/type-service';
import { CategoryService } from '../../category/services/category-service';

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
  #countryService = inject(CountryService);
  #typeService = inject(TypeService);
  #categoryService = inject(CategoryService);
  #logger = inject(LoggerService);
  #dialog = inject(MatDialog);
  #destroyRef = inject(DestroyRef);

  constructor() {
    this.load();
  }

  reload(): void {
    this.load();
  }

  openCreateDialog(): void {
    forkJoin({
      countries: this.#countryService.getAll(),
      types: this.#typeService.getAll(),
      categories: this.#categoryService.getAll(),
    })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (data) => {
          const dialogRef = this.#dialog.open(RecipeForm, { data: { ...data, recipe: null } });

          dialogRef.afterClosed()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((result?: RecipeRequest) => {
              if (!result) return;

              this.#recipeService.create({ ...result, categoryIds: result.categoryIds ?? [] })
                .pipe(takeUntilDestroyed(this.#destroyRef))
                .subscribe({
                  next: () => this.load(),
                  error: (error) => {
                    this.#logger.error('Failed to create recipe', error);
                    window.alert('Speichern fehlgeschlagen. Bitte versuche es später erneut.');
                  },
                });
            });
        },
        error: (error) => {
          this.#logger.error('Failed to load form data for recipe creation', error);
          window.alert('Formular konnte nicht geladen werden. Bitte versuche es später erneut.');
        },
      });
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
