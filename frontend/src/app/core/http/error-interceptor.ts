import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { LoggerService } from '../logging/logger-service';

/**
 * Logs every failed HTTP call once, with method/URL/status context, then
 * rethrows so callers can still react (e.g. show an inline error state).
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const logger = inject(LoggerService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      logger.error(`${req.method} ${req.url} failed (${error.status})`, error.message);
      return throwError(() => error);
    })
  );
};
