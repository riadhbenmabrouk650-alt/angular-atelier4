import { Component, signal, computed, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CategoryService } from '../../../core/services/category.service';
import { Category } from '../../../core/models/category.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ConfirmDialogComponent],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList implements OnInit {
  private readonly categoryService = inject(CategoryService);
  @ViewChild('confirmDialog') confirmDialog!: ConfirmDialogComponent;

  categories = signal<Category[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  toast = signal<{ message: string; type: 'success' | 'error' } | null>(null);

  newName = signal('');
  editingId = signal<number | null>(null);
  editName = signal('');

  total = computed(() => this.categories().length);

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.error.set(null);
    this.categoryService.getAll().subscribe({
      next: (res) => {
        this.categories.set(res.data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Impossible de charger les catégories.');
        this.loading.set(false);
      }
    });
  }

  addCategory() {
    const name = this.newName().trim();
    if (name.length < 2) {
      this.showToast('Le nom doit contenir au moins 2 caractères', 'error');
      return;
    }
    this.categoryService.create({ name }).subscribe({
      next: () => {
        this.newName.set('');
        this.showToast('Catégorie ajoutée avec succès', 'success');
        this.loadCategories();
      },
      error: (err: HttpErrorResponse) => this.showToast(this.errorMessage(err), 'error')
    });
  }

  startEdit(category: Category) {
    this.editingId.set(category.id);
    this.editName.set(category.name);
  }

  cancelEdit() {
    this.editingId.set(null);
    this.editName.set('');
  }

  saveEdit(category: Category) {
    const name = this.editName().trim();
    if (name.length < 2) {
      this.showToast('Le nom doit contenir au moins 2 caractères', 'error');
      return;
    }
    this.categoryService.update(category.id, { name }).subscribe({
      next: () => {
        this.cancelEdit();
        this.showToast('Catégorie modifiée avec succès', 'success');
        this.loadCategories();
      },
      error: (err: HttpErrorResponse) => this.showToast(this.errorMessage(err), 'error')
    });
  }

  deleteCategory(category: Category) {
    this.confirmDialog.open({
      title: 'Supprimer la catégorie',
      message: `Voulez-vous vraiment supprimer "${category.name}" ? Les produits associés n'auront plus de catégorie.`,
      confirmLabel: 'Supprimer',
      onConfirm: () => {
        this.categoryService.delete(category.id).subscribe({
          next: () => {
            this.showToast('Catégorie supprimée avec succès', 'success');
            this.loadCategories();
          },
          error: () => this.showToast('Erreur lors de la suppression', 'error')
        });
      }
    });
  }

  private errorMessage(err: HttpErrorResponse): string {
    if (err.status === 409) return 'Cette catégorie existe déjà';
    if (err.status === 400) return err.error?.errors?.[0] ?? 'Données invalides';
    return 'Une erreur est survenue';
  }

  showToast(message: string, type: 'success' | 'error') {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3500);
  }
}
