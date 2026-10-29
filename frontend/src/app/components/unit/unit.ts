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
import { UnitForm } from './unit-form/unit-form';
import { Unit as UnitModel, UnitRequest } from './models/unit.model';
import { UnitService } from './services/unit-service';

@Component({
  selector: 'app-unit',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './unit.html',
  styleUrl: './unit.css',
})
export class Unit {
  readonly units = signal<UnitModel[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  protected auth: AuthService | null = isPlatformBrowser(inject(PLATFORM_ID)) ? inject(AuthService) : null;

  #unitService = inject(UnitService);
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

  openEditDialog(unit: UnitModel): void {
    if (unit.inUse) {
      window.alert('Diese Maßeinheit wird verwendet und kann nicht geändert werden.');
      return;
    }
    this.openDialog(unit);
  }

  deleteUnit(unit: UnitModel): void {
    if (unit.inUse) {
      window.alert('Diese Maßeinheit wird verwendet und kann nicht gelöscht werden.');
      return;
    }
    if (!window.confirm(`"${unit.name}" wirklich löschen?`)) {
      return;
    }

    this.#unitService.delete(unit.id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.load(),
        error: (error) => {
          this.#logger.error('Failed to delete unit', error);
          window.alert('Löschen fehlgeschlagen. Bitte versuche es später erneut.');
        },
      });
  }

  private openDialog(unit: UnitModel | null): void {
    const dialogRef = this.#dialog.open(UnitForm, {
      data: { unit },
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((result?: UnitRequest) => {
        if (!result) return;

        const request$ = unit
          ? this.#unitService.update(unit.id, result)
          : this.#unitService.create(result);

        request$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
          next: () => this.load(),
          error: (error) => {
            this.#logger.error('Failed to save unit', error);
            window.alert('Speichern fehlgeschlagen. Bitte versuche es später erneut.');
          },
        });
      });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(false);

    this.#unitService.getAll()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (units) => {
          this.units.set(units);
          this.loading.set(false);
        },
        error: (error) => {
          this.#logger.error('Failed to load units', error);
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
