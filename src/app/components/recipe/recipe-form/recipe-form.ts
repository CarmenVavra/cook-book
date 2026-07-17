import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormField, form, required } from '@angular/forms/signals';
import { RecipeDetail, RecipeRequest } from '../models/recipe.model';
import { Country } from '../../country/models/country.model';
import { Type } from '../../type/models/type.model';
import { Category } from '../../category/models/category.model';

export interface RecipeFormData {
  recipe: RecipeDetail | null;
  countries: Country[];
  types: Type[];
  categories: Category[];
}

@Component({
  selector: 'app-recipe-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormField,
  ],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css',
})
export class RecipeForm {
  #dialogRef = inject(MatDialogRef<RecipeForm, RecipeRequest>);
  protected readonly data = inject<RecipeFormData>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.data.recipe !== null;

  protected readonly model = signal<RecipeRequest>({
    title: this.data.recipe?.title ?? '',
    text: this.data.recipe?.text ?? '',
    countryId: this.data.recipe?.countryId ?? null,
    typeId: this.data.recipe?.typeId ?? null,
    categoryIds: this.data.recipe?.categories.map((category) => category.id) ?? [],
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

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.recipeForm().valid()) {
      return;
    }
    this.#dialogRef.close(this.model());
  }

  protected cancel(): void {
    this.#dialogRef.close();
  }
}
