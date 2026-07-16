import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, PLATFORM_ID, effect, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoggerService } from '../../../core/logging/logger-service';
import { RecipeDetail as RecipeDetailModel } from '../models/recipe.model';
import { RecipeService } from '../services/recipe-service';

@Component({
  selector: 'app-recipe-detail',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail {
  readonly id = input.required<string>();

  readonly recipe = signal<RecipeDetailModel | null>(null);
  readonly loading = signal(true);
  readonly error = signal(false);

  protected auth: AuthService | null = isPlatformBrowser(inject(PLATFORM_ID)) ? inject(AuthService) : null;
  #currentUser = toSignal(this.auth?.user$ ?? of(null), { initialValue: null });

  #recipeService = inject(RecipeService);
  #logger = inject(LoggerService);
  #destroyRef = inject(DestroyRef);
  #router = inject(Router);

  constructor() {
    effect(() => {
      this.load(Number(this.id()));
    });
  }

  reload(): void {
    this.load(Number(this.id()));
  }

  isOwner(): boolean {
    const sub = this.#currentUser()?.sub;
    return !!sub && this.recipe()?.ownerSub === sub;
  }

  deleteRecipe(): void {
    const recipe = this.recipe();
    if (!recipe) return;
    if (!window.confirm(`"${recipe.title}" wirklich löschen?`)) {
      return;
    }

    this.#recipeService.delete(recipe.id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.#router.navigateByUrl('/recipes'),
        error: (error) => {
          this.#logger.error('Failed to delete recipe', error);
          window.alert('Löschen fehlgeschlagen. Bitte versuche es später erneut.');
        },
      });
  }

  private load(id: number): void {
    this.loading.set(true);
    this.error.set(false);

    this.#recipeService.getById(id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (recipe) => {
          this.recipe.set(recipe);
          this.loading.set(false);
        },
        error: (error) => {
          this.#logger.error('Failed to load recipe detail', error);
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
