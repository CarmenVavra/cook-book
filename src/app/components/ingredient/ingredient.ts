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
import { IngredientForm } from './ingredient-form/ingredient-form';
import { Ingredient as IngredientModel, IngredientRequest } from './models/ingredient.model';
import { IngredientService } from './services/ingredient-service';
import { Unit } from '../unit/models/unit.model';
import { UnitService } from '../unit/services/unit-service';

@Component({
  selector: 'app-ingredient',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './ingredient.html',
  styleUrl: './ingredient.css',
})
export class Ingredient {
  readonly ingredients = signal<IngredientModel[]>([]);
  readonly units = signal<Unit[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  protected auth: AuthService | null = isPlatformBrowser(inject(PLATFORM_ID)) ? inject(AuthService) : null;

  #ingredientService = inject(IngredientService);
  #unitService = inject(UnitService);
  #logger = inject(LoggerService);
  #dialog = inject(MatDialog);
  #destroyRef = inject(DestroyRef);

  constructor() {
    this.load();
    this.loadUnits();
  }

  reload(): void {
    this.load();
  }

  openCreateDialog(): void {
    this.openDialog(null);
  }

  openEditDialog(ingredient: IngredientModel): void {
    this.openDialog(ingredient);
  }

  deleteIngredient(ingredient: IngredientModel): void {
    if (!window.confirm(`"${ingredient.name}" wirklich löschen?`)) {
      return;
    }

    this.#ingredientService.delete(ingredient.id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.load(),
        error: (error) => {
          this.#logger.error('Failed to delete ingredient', error);
          window.alert('Löschen fehlgeschlagen. Bitte versuche es später erneut.');
        },
      });
  }

  private openDialog(ingredient: IngredientModel | null): void {
    const dialogRef = this.#dialog.open(IngredientForm, {
      data: { ingredient, units: this.units() },
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((result?: IngredientRequest) => {
        if (!result) return;

        const request$ = ingredient
          ? this.#ingredientService.update(ingredient.id, result)
          : this.#ingredientService.create(result);

        request$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
          next: () => this.load(),
          error: (error) => {
            this.#logger.error('Failed to save ingredient', error);
            window.alert('Speichern fehlgeschlagen. Bitte versuche es später erneut.');
          },
        });
      });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(false);

    this.#ingredientService.getAll()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (ingredients) => {
          this.ingredients.set(ingredients);
          this.loading.set(false);
        },
        error: (error) => {
          this.#logger.error('Failed to load ingredients', error);
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }

  private loadUnits(): void {
    this.#unitService.getAll()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (units) => this.units.set(units),
        error: (error) => this.#logger.error('Failed to load units for ingredient form', error),
      });
  }
}
