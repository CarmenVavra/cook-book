import { ErrorHandler, Injectable, inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '../logging/logger-service';

/**
 * Catches errors that escape component/template code (thrown in event
 * handlers, unhandled promise rejections, etc). HTTP errors are excluded
 * here because the error-interceptor already logs them with request
 * context; re-logging them here would just duplicate the entry.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  #logger = inject(LoggerService);

  handleError(error: unknown): void {
    if (error instanceof HttpErrorResponse) {
      return;
    }
    this.#logger.error('Unhandled application error', error);
  }
}
