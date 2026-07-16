import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoggerService } from '../../../core/logging/logger-service';
import { Type } from '../../type/models/type.model';
import { TypeService } from '../../type/services/type-service';

@Component({
  selector: 'app-recipe-types',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './recipe-types.html',
  styleUrl: './recipe-types.css',
})
export class RecipeTypes {
  readonly types = signal<Type[]>([]);
  readonly loading = signal(true);
  readonly error = signal(false);

  #typeService = inject(TypeService);
  #logger = inject(LoggerService);
  #destroyRef = inject(DestroyRef);

  constructor() {
    this.load();
  }

  reload(): void {
    this.load();
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
          this.#logger.error('Failed to load types for recipe browsing', error);
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
