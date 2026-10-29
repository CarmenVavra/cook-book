export interface CategoryRef {
  id: number;
  name: string;
}

export interface IngredientRef {
  id: number;
  name: string;
  unitId: number | null;
  unitName: string | null;
  unitNameShort: string | null;
  amount: number | null;
}

export interface RecipeIngredientRequest {
  ingredientId: number;
  unitId: number | null;
  amount: number | null;
}

export interface RecipeSummary {
  id: number;
  title: string;
  countryId: number | null;
  countryName: string | null;
  typeId: number | null;
  typeName: string | null;
  categories: CategoryRef[];
  ownerSub: string | null;
}

export interface RecipeDetail extends RecipeSummary {
  text: string | null;
  ingredients: IngredientRef[];
}

export interface RecipeRequest {
  title: string;
  text: string;
  countryId: number | null;
  typeId: number | null;
  categoryIds: number[];
  ingredients: RecipeIngredientRequest[];
}
