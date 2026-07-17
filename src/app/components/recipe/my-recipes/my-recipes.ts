import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { forkJoin, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { LoggerService } from '../../../core/logging/logger-service';
import { RecipeRequest, RecipeSummary } from '../models/recipe.model';
import { RecipeService } from '../services/recipe-service';
import { RecipeForm } from '../recipe-form/recipe-form';
import { Country } from '../../country/models/country.model';
import { CountryService } from '../../country/services/country-service';
import { Type } from '../../type/models/type.model';
import { TypeService } from '../../type/services/type-service';
import { Category } from '../../category/models/category.model';
import { CategoryService } from '../../category/services/category-service';
import { Ingredient } from '../../ingredient/models/ingredient.model';
import { IngredientService } from '../../ingredient/services/ingredient-service';
import { Unit } from '../../unit/models/unit.model';
import { UnitService } from '../../unit/services/unit-service';

@Component({
  selector: 'app-my-recipes',
  imports: [
    AsyncPipe,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './my-recipes.html',
  styleUrl: './my-recipes.css',
})
export class MyRecipes {
  readonly recipes = signal<RecipeSummary[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  readonly types = signal<Type[]>([]);
  readonly countries = signal<Country[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly ingredients = signal<Ingredient[]>([]);
  readonly units = signal<Unit[]>([]);

  readonly typeFilter = signal<number | null>(null);
  readonly countryFilter = signal<number | null>(null);
  readonly categoryFilter = signal<number | null>(null);

  readonly hasActiveFilter = computed(() =>
    this.typeFilter() != null || this.countryFilter() != null || this.categoryFilter() != null
  );

  protected auth: AuthService | null = isPlatformBrowser(inject(PLATFORM_ID)) ? inject(AuthService) : null;
  #currentUser = toSignal(this.auth?.user$ ?? of(null), { initialValue: null });

  readonly myRecipes = computed(() => {
    const sub = this.#currentUser()?.sub;
    if (!sub) return [];

    const typeId = this.typeFilter();
    const countryId = this.countryFilter();
    const categoryId = this.categoryFilter();

    return this.recipes().filter((recipe) => {
      if (recipe.ownerSub !== sub) return false;
      if (typeId != null && recipe.typeId !== typeId) return false;
      if (countryId != null && recipe.countryId !== countryId) return false;
      if (categoryId != null && !recipe.categories.some((category) => category.id === categoryId)) return false;
      return true;
    });
  });

  #recipeService = inject(RecipeService);
  #countryService = inject(CountryService);
  #typeService = inject(TypeService);
  #categoryService = inject(CategoryService);
  #ingredientService = inject(IngredientService);
  #unitService = inject(UnitService);
  #logger = inject(LoggerService);
  #dialog = inject(MatDialog);
  #destroyRef = inject(DestroyRef);

  constructor() {
    this.load();
    this.loadFilterOptions();
  }

  reload(): void {
    this.load();
  }

  resetFilters(): void {
    this.typeFilter.set(null);
    this.countryFilter.set(null);
    this.categoryFilter.set(null);
  }

  onTypeFilterChange(event: MatSelectChange): void {
    this.typeFilter.set(event.value);
  }

  onCountryFilterChange(event: MatSelectChange): void {
    this.countryFilter.set(event.value);
  }

  onCategoryFilterChange(event: MatSelectChange): void {
    this.categoryFilter.set(event.value);
  }

  openCreateDialog(): void {
    const dialogRef = this.#dialog.open(RecipeForm, {
      data: {
        recipe: null,
        countries: this.countries(),
        types: this.types(),
        categories: this.categories(),
        ingredients: this.ingredients(),
        units: this.units(),
      },
    });

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

  private loadFilterOptions(): void {
    forkJoin({
      countries: this.#countryService.getAll(),
      types: this.#typeService.getAll(),
      categories: this.#categoryService.getAll(),
      ingredients: this.#ingredientService.getAll(),
      units: this.#unitService.getAll(),
    })
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: ({ countries, types, categories, ingredients, units }) => {
          this.countries.set(countries);
          this.types.set(types);
          this.categories.set(categories);
          this.ingredients.set(ingredients);
          this.units.set(units);
        },
        error: (error) => {
          this.#logger.error('Failed to load filter options for the my-recipes page', error);
        },
      });
  }
}
