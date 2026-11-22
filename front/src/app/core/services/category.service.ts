import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CategoryListResponse, CategoryResponse } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:3000/api/categories';

  getAll(): Observable<CategoryListResponse> {
    return this.http.get<CategoryListResponse>(this.baseUrl);
  }

  getById(id: number): Observable<CategoryResponse> {
    return this.http.get<CategoryResponse>(`${this.baseUrl}/${id}`);
  }

  create(data: { name: string }): Observable<CategoryResponse> {
    return this.http.post<CategoryResponse>(this.baseUrl, data);
  }

  update(id: number, data: { name: string }): Observable<CategoryResponse> {
    return this.http.put<CategoryResponse>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.baseUrl}/${id}`);
  }
}
