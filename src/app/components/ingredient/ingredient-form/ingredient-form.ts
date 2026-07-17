import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormField, form, required } from '@angular/forms/signals';
import { Ingredient, IngredientRequest } from '../models/ingredient.model';
import { Unit } from '../../unit/models/unit.model';

export interface IngredientFormData {
  ingredient: Ingredient | null;
  units: Unit[];
}

@Component({
  selector: 'app-ingredient-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormField,
  ],
  templateUrl: './ingredient-form.html',
  styleUrl: './ingredient-form.css',
})
export class IngredientForm {
  #dialogRef = inject(MatDialogRef<IngredientForm, IngredientRequest>);
  #data = inject<IngredientFormData>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.#data.ingredient !== null;
  protected readonly units = this.#data.units;

  protected readonly model = signal<IngredientRequest>({
    name: this.#data.ingredient?.name ?? '',
    unitId: this.#data.ingredient?.unitId ?? null,
  });

  protected readonly ingredientForm = form(this.model, (f) => {
    required(f.name, { message: 'Name ist erforderlich' });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.ingredientForm().valid()) {
      return;
    }
    this.#dialogRef.close(this.model());
  }

  protected cancel(): void {
    this.#dialogRef.close();
  }
}
