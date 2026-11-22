export interface Category {
  id: number;
  name: string;
}

export interface CategoryListResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}
