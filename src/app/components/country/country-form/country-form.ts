import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormField, form, maxLength, required } from '@angular/forms/signals';
import { Country, CountryRequest } from '../models/country.model';

export interface CountryFormData {
  country: Country | null;
}

@Component({
  selector: 'app-country-form',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, FormField],
  templateUrl: './country-form.html',
  styleUrl: './country-form.css',
})
export class CountryForm {
  #dialogRef = inject(MatDialogRef<CountryForm, CountryRequest>);
  #data = inject<CountryFormData>(MAT_DIALOG_DATA);

  protected readonly isEdit = this.#data.country !== null;

  protected readonly model = signal<CountryRequest>({
    name: this.#data.country?.name ?? '',
    nameShort: this.#data.country?.nameShort ?? '',
    adjective: this.#data.country?.adjective ?? '',
  });

  protected readonly countryForm = form(this.model, (f) => {
    required(f.name, { message: 'Name ist erforderlich' });
    maxLength(f.nameShort, 3, { message: 'Höchstens 3 Zeichen' });
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.countryForm().valid()) {
      return;
    }
    this.#dialogRef.close(this.model());
  }

  protected cancel(): void {
    this.#dialogRef.close();
  }
}
