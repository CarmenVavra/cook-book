import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Category } from './components/category/category';
import { Country } from './components/country/country';
import { Type } from './components/type/type';
import { RecipeTypes } from './components/recipe/recipe-types/recipe-types';
import { RecipeCategories } from './components/recipe/recipe-categories/recipe-categories';
import { RecipeList } from './components/recipe/recipe-list/recipe-list';
import { RecipeDetail } from './components/recipe/recipe-detail/recipe-detail';
import { MyRecipes } from './components/recipe/my-recipes/my-recipes';

export const routes: Routes = [
  { path: "category", component: Category },
  { path: "country", component: Country },
  { path: "type", component: Type },
  { path: "my-recipes", component: MyRecipes },
  { path: "my-recipes/:id", component: RecipeDetail },
  { path: "recipes/type/:typeId/category/:categoryId", component: RecipeList },
  { path: "recipes/type/:typeId", component: RecipeCategories },
  { path: "recipes/:id", component: RecipeDetail },
  { path: "recipes", component: RecipeTypes },
  { path: "", component: Home },
  { path: "**", redirectTo: "", pathMatch: 'full' }
];
