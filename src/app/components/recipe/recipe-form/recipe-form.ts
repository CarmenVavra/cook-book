import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule, MatSelectChange } from '@angular/material/select';
import { FormField, form, required } from '@angular/forms/signals';
import { forkJoin, map } from 'rxjs';
import { RecipeDetail, RecipeIngredientRequest, RecipeRequest } from '../models/recipe.model';
import { Country } from '../../country/models/country.model';
import { Type } from '../../type/models/type.model';
import { Category } from '../../category/models/category.model';
import { Ingredient } from '../../ingredient/models/ingredient.model';
import { IngredientService } from '../../ingredient/services/ingredient-service';
import { Unit } from '../../unit/models/unit.model';
import { LoggerService } from '../../../core/logging/logger-service';

export interface RecipeFormData {
  recipe: RecipeDetail | null;
  countries: Country[];
  types: Type[];
  categories: Category[];
  ingredients: Ingredient[];
  units: Unit[];
}

interface IngredientRowModel {
  ingredientId: number | null;
  ingredientName: string;
  unitId: number | null;
  amount: number | null;
}

interface RecipeFormModel {
  title: string;
  text: string;
  countryId: number | null;
  typeId: number | null;
  categoryIds: number[];
  ingredients: IngredientRowModel[];
}

@Component({
  selector: 'app-recipe-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    FormField,
  ],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css',
})
export class RecipeForm {
  #dialogRef = inject(MatDialogRef<RecipeForm, RecipeRequest>);
  #ingredientService = inject(IngredientService);
  #logger = inject(LoggerService);
  protected readonly data = inject<RecipeFormData>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data.recipe !== null;

  protected readonly model = signal<RecipeFormModel>({
    title: this.data.recipe?.title ?? '',
    text: this.data.recipe?.text ?? '',
    countryId: this.data.recipe?.countryId ?? null,
    typeId: this.data.recipe?.typeId ?? null,
    categoryIds: this.data.recipe?.categories.map((category) => category.id) ?? [],
    ingredients: this.data.recipe?.ingredients.map((ingredient) => ({
      ingredientId: ingredient.id,
      ingredientName: ingredient.name,
      unitId: ingredient.unitId,
      amount: ingredient.amount,
    })) ?? [],
  });

  protected readonly recipeForm = form(this.model, (f) => {
    required(f.title, { message: 'Titel ist erforderlich' });
  });

  protected isCategorySelected(categoryId: number): boolean {
    return this.model().categoryIds.includes(categoryId);
  }

  protected toggleCategory(categoryId: number, checked: boolean): void {
    this.model.update((current) => ({
      ...current,
      categoryIds: checked
        ? [...current.categoryIds, categoryId]
        : current.categoryIds.filter((id) => id !== categoryId),
    }));
  }

  protected addIngredientRow(): void {
    this.model.update((current) => ({
      ...current,
      ingredients: [...current.ingredients, { ingredientId: null, ingredientName: '', unitId: null, amount: null }],
    }));
  }

  protected removeIngredientRow(index: number): void {
    this.model.update((current) => ({
      ...current,
      ingredients: current.ingredients.filter((_, i) => i !== index),
    }));
  }

  protected filteredIngredientsFor(query: string): Ingredient[] {
    const term = query.trim().toLowerCase();
    if (!term) return this.data.ingredients;
    return this.data.ingredients.filter((ingredient) => ingredient.name.toLowerCase().includes(term));
  }

  protected onIngredientNameChange(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.updateIngredientRow(index, { ingredientName: value, ingredientId: null });
  }

  protected onIngredientSelected(index: number, event: MatAutocompleteSelectedEvent): void {
    const name = event.option.value as string;
    const ingredient = this.findIngredientByName(name);
    this.updateIngredientRow(index, { ingredientName: name, ingredientId: ingredient?.id ?? null });
  }

  protected onUnitChange(index: number, event: MatSelectChange): void {
    this.updateIngredientRow(index, { unitId: event.value });
  }

  protected onAmountChange(index: number, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.updateIngredientRow(index, { amount: raw === '' ? null : Number(raw) });
  }

  private updateIngredientRow(index: number, changes: Partial<IngredientRowModel>): void {
    this.model.update((current) => ({
      ...current,
      ingredients: current.ingredients.map((row, i) => (i === index ? { ...row, ...changes } : row)),
    }));
  }

  private findIngredientByName(name: string): Ingredient | undefined {
    const term = name.trim().toLowerCase();
    return this.data.ingredients.find((ingredient) => ingredient.name.toLowerCase() === term);
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.recipeForm().valid()) {
      return;
    }

    const model = this.model();
    const rows = model.ingredients.filter((row) => row.ingredientName.trim().length > 0);

    const newNames = new Map<string, string>();
    for (const row of rows) {
      if (row.ingredientId == null && !this.findIngredientByName(row.ingredientName)) {
        const key = row.ingredientName.trim().toLowerCase();
        if (!newNames.has(key)) {
          newNames.set(key, row.ingredientName.trim());
        }
      }
    }

    if (newNames.size === 0) {
      this.closeWith(model, rows);
      return;
    }

    const creations = Array.from(newNames.entries()).map(([key, name]) =>
      this.#ingredientService.create({ name }).pipe(map((ingredient) => [key, ingredient] as const))
    );

    forkJoin(creations).subscribe({
      next: (createdPairs) => this.closeWith(model, rows, new Map(createdPairs)),
      error: (error) => {
        this.#logger.error('Failed to create new ingredient(s) from recipe form', error);
        window.alert('Eine neue Zutat konnte nicht gespeichert werden. Bitte versuche es erneut.');
      },
    });
  }

  private closeWith(model: RecipeFormModel, rows: IngredientRowModel[], createdByKey?: Map<string, Ingredient>): void {
    const ingredients: RecipeIngredientRequest[] = rows.map((row) => {
      if (row.ingredientId != null) {
        return { ingredientId: row.ingredientId, unitId: row.unitId, amount: row.amount };
      }
      const existing = this.findIngredientByName(row.ingredientName);
      const resolvedId = existing?.id ?? createdByKey?.get(row.ingredientName.trim().toLowerCase())?.id;
      return { ingredientId: resolvedId!, unitId: row.unitId, amount: row.amount };
    });

    this.#dialogRef.close({
      title: model.title,
      text: model.text,
      countryId: model.countryId,
      typeId: model.typeId,
      categoryIds: model.categoryIds,
      ingredients,
    });
  }

  protected cancel(): void {
    this.#dialogRef.close();
  }
}
