import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormField, form, required } from '@angular/forms/signals';
import { Type, TypeRequest } from '../models/type.model';

export interface TypeFormData {
  type: Type | null;
}

@Component({
  selector: 'app-type-form',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormField],
  templateUrl: './type-form.html',
  styleUrl: './type-form.css',
})
export class TypeForm {
  #dialogRef = inject(MatDialogRef<TypeForm, TypeRequest>);
  #data = inject<TypeFormData>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.#data.type !== null;

  protected readonly model = signal<TypeRequest>({
    name: this.#data.type?.name ?? '',
  });

  protected readonly typeForm = form(this.model, (f) => {
    required(f.name, { message: 'Name ist erforderlich' });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.typeForm().valid()) {
      return;
    }
    this.#dialogRef.close(this.model());
  }

  protected cancel(): void {
    this.#dialogRef.close();
  }
}
