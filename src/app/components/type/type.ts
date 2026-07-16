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
import { TypeForm } from './type-form/type-form';
import { Type as TypeModel, TypeRequest } from './models/type.model';
import { TypeService } from './services/type-service';

@Component({
  selector: 'app-type',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './type.html',
  styleUrl: './type.css',
})
export class Type {
  readonly types = signal<TypeModel[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  protected auth: AuthService | null = isPlatformBrowser(inject(PLATFORM_ID)) ? inject(AuthService) : null;

  #typeService = inject(TypeService);
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

  openEditDialog(type: TypeModel): void {
    this.openDialog(type);
  }

  deleteType(type: TypeModel): void {
    if (!window.confirm(`"${type.name}" wirklich löschen?`)) {
      return;
    }

    this.#typeService.delete(type.id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.load(),
        error: (error) => {
          this.#logger.error('Failed to delete type', error);
          window.alert('Löschen fehlgeschlagen. Bitte versuche es später erneut.');
        },
      });
  }

  private openDialog(type: TypeModel | null): void {
    const dialogRef = this.#dialog.open(TypeForm, {
      data: { type },
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((result?: TypeRequest) => {
        if (!result) return;

        const request$ = type
          ? this.#typeService.update(type.id, result)
          : this.#typeService.create(result);

        request$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
          next: () => this.load(),
          error: (error) => {
            this.#logger.error('Failed to save type', error);
            window.alert('Speichern fehlgeschlagen. Bitte versuche es später erneut.');
          },
        });
      });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(false);

    this.#typeService.getAll()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (types) => {
          this.types.set(types);
          this.loading.set(false);
        },
        error: (error) => {
          this.#logger.error('Failed to load types', error);
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
