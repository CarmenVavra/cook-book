import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'my-recipes/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'recipes/type/:typeId/category/:categoryId',
    renderMode: RenderMode.Server
  },
  {
    path: 'recipes/type/:typeId',
    renderMode: RenderMode.Server
  },
  {
    path: 'recipes/:id',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
