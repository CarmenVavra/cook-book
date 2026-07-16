import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormField, form, required } from '@angular/forms/signals';
import { Category, CategoryRequest } from '../models/category.model';

export interface CategoryFormData {
  category: Category | null;
  categories: Category[];
}

@Component({
  selector: 'app-category-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormField,
  ],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  #dialogRef = inject(MatDialogRef<CategoryForm, CategoryRequest>);
  #data = inject<CategoryFormData>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.#data.category !== null;

  protected readonly parentOptions = this.#data.categories.filter(
    (category) => category.id !== this.#data.category?.id
  );

  protected readonly model = signal<CategoryRequest>({
    name: this.#data.category?.name ?? '',
    parentId: this.#data.category?.parentId ?? null,
  });

  protected readonly categoryForm = form(this.model, (f) => {
    required(f.name, { message: 'Name ist erforderlich' });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.categoryForm().valid()) {
      return;
    }
    this.#dialogRef.close(this.model());
  }

  protected cancel(): void {
    this.#dialogRef.close();
  }
}
