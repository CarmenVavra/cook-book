import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, PLATFORM_ID, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth0/auth0-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoggerService } from '../../core/logging/logger-service';
import { CountryForm } from './country-form/country-form';
import { Country as CountryModel, CountryRequest } from './models/country.model';
import { CountryService } from './services/country-service';

@Component({
  selector: 'app-country',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './country.html',
  styleUrl: './country.css',
})
export class Country {
  readonly countries = signal<CountryModel[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  protected auth: AuthService | null = isPlatformBrowser(inject(PLATFORM_ID)) ? inject(AuthService) : null;

  #countryService = inject(CountryService);
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
    this.openDialog(null);
  }

  openEditDialog(country: CountryModel): void {
    this.openDialog(country);
  }

  deleteCountry(country: CountryModel): void {
    if (!window.confirm(`"${country.name}" wirklich löschen?`)) {
      return;
    }

    this.#countryService.delete(country.id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.load(),
        error: (error) => {
          this.#logger.error('Failed to delete country', error);
          window.alert('Löschen fehlgeschlagen. Bitte versuche es später erneut.');
        },
      });
  }

  private openDialog(country: CountryModel | null): void {
    const dialogRef = this.#dialog.open(CountryForm, {
      data: { country },
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((result?: CountryRequest) => {
        if (!result) return;

        const request$ = country
          ? this.#countryService.update(country.id, result)
          : this.#countryService.create(result);

        request$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
          next: () => this.load(),
          error: (error) => {
            this.#logger.error('Failed to save country', error);
            window.alert('Speichern fehlgeschlagen. Bitte versuche es später erneut.');
          },
        });
      });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(false);

    this.#countryService.getAll()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (countries) => {
          this.countries.set(countries);
          this.loading.set(false);
        },
        error: (error) => {
          this.#logger.error('Failed to load countries', error);
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
