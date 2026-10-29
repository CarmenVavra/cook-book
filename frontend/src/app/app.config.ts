import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authHttpInterceptorFn, provideAuth0 } from '@auth0/auth0-angular';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/http/error-interceptor';
import { GlobalErrorHandler } from './core/error-handling/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor])),
    provideRouter(routes, withComponentInputBinding()), provideClientHydration(withEventReplay()),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
};

export const appConfigWithAuth0: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(withFetch(), withInterceptors([authHttpInterceptorFn, errorInterceptor])),
    provideRouter(routes, withComponentInputBinding()), provideClientHydration(withEventReplay()),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    provideAuth0({
      // domain: "domain-Auth0",
      // clientId: "clientId-Auth0",
      domain: "dev-z1rx7ajasjajys63.us.auth0.com",
      clientId: "fa1zkKqU2grnFmuL64YwSOX8seNvNjyV",
      authorizationParams: {
        redirect_uri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4200',
        audience: 'https://cookbook-api',
      },
      cacheLocation: 'localstorage',
      useRefreshTokens: true,
      httpInterceptor: {
        allowedList: [{ uri: 'http://localhost:8080/*', allowAnonymous: true }],
      },
    }),
  ]
};

