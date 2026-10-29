import { bootstrapApplication } from '@angular/platform-browser';
import { appConfigWithAuth0 } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfigWithAuth0)
  .catch((err) => console.error(err));
