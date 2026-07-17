import { Location, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, PLATFORM_ID, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth0/auth0-angular';
import { forkJoin, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoggerService } from '../../../core/logging/logger-service';
import { RecipeDetail as RecipeDetailModel, RecipeRequest } from '../models/recipe.model';
import { RecipeService } from '../services/recipe-service';
import { RecipeForm } from '../recipe-form/recipe-form';
import { CountryService } from '../../country/services/country-service';
import { TypeService } from '../../type/services/type-service';
import { CategoryService } from '../../category/services/category-service';
import { IngredientService } from '../../ingredient/services/ingredient-service';
import { UnitService } from '../../unit/services/unit-service';

@Component({
  selector: 'app-recipe-detail',
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail {
  readonly id = input.required<string>();

  readonly recipe = signal<RecipeDetailModel | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  protected auth: AuthService | null = isPlatformBrowser(inject(PLATFORM_ID)) ? inject(AuthService) : null;
  #currentUser = toSignal(this.auth?.user$ ?? of(null), { initialValue: null });

  #recipeService = inject(RecipeService);
  #countryService = inject(CountryService);
  #typeService = inject(TypeService);
  #categoryService = inject(CategoryService);
  #ingredientService = inject(IngredientService);
  #unitService = inject(UnitService);
  #logger = inject(LoggerService);
  #dialog = inject(MatDialog);
  #destroyRef = inject(DestroyRef);
  #location = inject(Location);

  constructor() {
    effect(() => {
      this.load(Number(this.id()));
    });
  }

  reload(): void {
    this.load(Number(this.id()));
  }

  goBack(): void {
    this.#location.back();
  }

  isOwner(): boolean {
    const sub = this.#currentUser()?.sub;
    return !!sub && this.recipe()?.ownerSub === sub;
  }

  openEditDialog(): void {
    const recipe = this.recipe();
    if (!recipe) return;

    forkJoin({
      countries: this.#countryService.getAll(),
      types: this.#typeService.getAll(),
      categories: this.#categoryService.getAll(),
      ingredients: this.#ingredientService.getAll(),
      units: this.#unitService.getAll(),
    })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (data) => {
          const dialogRef = this.#dialog.open(RecipeForm, { data: { ...data, recipe } });

          dialogRef.afterClosed()
            .pipe(takeUntilDestroyed(this.#destroyRef))
            .subscribe((result?: RecipeRequest) => {
              if (!result) return;

              this.#recipeService.update(recipe.id, result)
                .pipe(takeUntilDestroyed(this.#destroyRef))
                .subscribe({
                  next: () => this.reload(),
                  error: (error) => {
                    this.#logger.error('Failed to update recipe', error);
                    window.alert('Speichern fehlgeschlagen. Bitte versuche es später erneut.');
                  },
                });
            });
        },
        error: (error) => {
          this.#logger.error('Failed to load form data for recipe editing', error);
          window.alert('Formular konnte nicht geladen werden. Bitte versuche es später erneut.');
        },
      });
  }

  deleteRecipe(): void {
    const recipe = this.recipe();
    if (!recipe) return;
    if (!window.confirm(`"${recipe.title}" wirklich löschen?`)) {
      return;
    }

    this.#recipeService.delete(recipe.id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.goBack(),
        error: (error) => {
          this.#logger.error('Failed to delete recipe', error);
          window.alert('Löschen fehlgeschlagen. Bitte versuche es später erneut.');
        },
      });
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
