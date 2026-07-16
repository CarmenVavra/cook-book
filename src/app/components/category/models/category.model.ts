export interface Category {
  id: number;
  name: string;
  parentId: number | null;
  parentName: string | null;
  childCount: number;
}

export interface CategoryRequest {
  name: string;
  parentId: number | null;
}
