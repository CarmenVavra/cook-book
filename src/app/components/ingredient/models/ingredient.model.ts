export interface Ingredient {
  id: number;
  name: string;
  unitId: number | null;
  unitName: string | null;
}

export interface IngredientRequest {
  name: string;
  unitId: number | null;
}
