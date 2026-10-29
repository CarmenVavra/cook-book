import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '@auth0/auth0-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoggerService } from '../../core/logging/logger-service';
import { CategoryForm } from './category-form/category-form';
import { Category as CategoryModel, CategoryRequest } from './models/category.model';
import { CategoryService } from './services/category-service';

interface CategoryRow extends CategoryModel {
  depth: number;
  expanded: boolean;
}

function buildRows(categories: CategoryModel[], expandedIds: ReadonlySet<number>): CategoryRow[] {
  const byParent = new Map<number | null, CategoryModel[]>();
  for (const category of categories) {
    const siblings = byParent.get(category.parentId) ?? [];
    siblings.push(category);
    byParent.set(category.parentId, siblings);
  }
  for (const siblings of byParent.values()) {
    siblings.sort((a, b) => a.name.localeCompare(b.name));
  }

  const rows: CategoryRow[] = [];
  const maxDepth = 20;

  function walk(parentId: number | null, depth: number): void {
    if (depth > maxDepth) return;
    for (const category of byParent.get(parentId) ?? []) {
      const expanded = expandedIds.has(category.id);
      rows.push({ ...category, depth, expanded });
      if (category.childCount > 0 && expanded) {
        walk(category.id, depth + 1);
      }
    }
  }

  walk(null, 0);
  return rows;
}

@Component({
  selector: 'app-category',
  imports: [AsyncPipe, MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './category.html',
  styleUrl: './category.css',
})
export class Category {
  readonly categories = signal<CategoryModel[]>([]);
  readonly expandedIds = signal<ReadonlySet<number>>(new Set());
  readonly rows = computed(() => buildRows(this.categories(), this.expandedIds()));
  readonly loading = signal(true);
  readonly error = signal(false);

  protected auth: AuthService | null = isPlatformBrowser(inject(PLATFORM_ID)) ? inject(AuthService) : null;

  #categoryService = inject(CategoryService);
  #logger = inject(LoggerService);
  #dialog = inject(MatDialog);
  #destroyRef = inject(DestroyRef);

  constructor() {
    this.load();
  }

  reload(): void {
    this.load();
  }

  toggleExpand(category: CategoryModel): void {
    if (category.childCount === 0) return;

    const next = new Set(this.expandedIds());
    if (next.has(category.id)) {
      next.delete(category.id);
    } else {
      next.add(category.id);
    }
    this.expandedIds.set(next);
  }

  openCreateDialog(): void {
    this.openDialog(null);
  }

  openEditDialog(category: CategoryModel): void {
    this.openDialog(category);
  }

  deleteCategory(category: CategoryModel): void {
    if (category.childCount > 0) {
      window.alert('Diese Kategorie hat Unterkategorien und kann nicht gelöscht werden.');
      return;
    }
    if (!window.confirm(`"${category.name}" wirklich löschen?`)) {
      return;
    }

    this.#categoryService.delete(category.id)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.load(),
        error: (error) => {
          this.#logger.error('Failed to delete category', error);
          window.alert('Löschen fehlgeschlagen. Bitte versuche es später erneut.');
        },
      });
  }

  private openDialog(category: CategoryModel | null): void {
    const dialogRef = this.#dialog.open(CategoryForm, {
      data: { category, categories: this.categories() },
    });

    dialogRef.afterClosed()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((result?: CategoryRequest) => {
        if (!result) return;

        const request$ = category
          ? this.#categoryService.update(category.id, result)
          : this.#categoryService.create(result);

        request$.pipe(takeUntilDestroyed(this.#destroyRef)).subscribe({
          next: () => this.load(),
          error: (error) => {
            this.#logger.error('Failed to save category', error);
            window.alert('Speichern fehlgeschlagen. Bitte versuche es später erneut.');
          },
        });
      });
  }

  private load(): void {
    this.loading.set(true);
    this.error.set(false);

    this.#categoryService.getAll()
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: (categories) => {
          this.categories.set(categories);
          this.loading.set(false);
        },
        error: (error) => {
          this.#logger.error('Failed to load categories for the category page', error);
          this.error.set(true);
          this.loading.set(false);
        },
      });
  }
}
