import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormField, form, required } from '@angular/forms/signals';
import { Unit, UnitRequest } from '../models/unit.model';

export interface UnitFormData {
  unit: Unit | null;
}

@Component({
  selector: 'app-unit-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormField,
  ],
  templateUrl: './unit-form.html',
  styleUrl: './unit-form.css',
})
export class UnitForm {
  #dialogRef = inject(MatDialogRef<UnitForm, UnitRequest>);
  #data = inject<UnitFormData>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.#data.unit !== null;

  protected readonly model = signal({
    name: this.#data.unit?.name ?? '',
    nameShort: this.#data.unit?.nameShort ?? '',
  });

  protected readonly unitForm = form(this.model, (f) => {
    required(f.name, { message: 'Name ist erforderlich' });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.unitForm().valid()) {
      return;
    }
    const value = this.model();
    const request: UnitRequest = { name: value.name, nameShort: value.nameShort || null };
    this.#dialogRef.close(request);
  }

  protected cancel(): void {
    this.#dialogRef.close();
  }
}
