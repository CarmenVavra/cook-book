export interface CategoryRef {
  id: number;
  name: string;
}

export interface IngredientRef {
  id: number;
  name: string;
  unitName: string | null;
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
}
