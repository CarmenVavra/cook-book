import { Injectable, isDevMode } from '@angular/core';

export enum LogLevel {
  Debug = 0,
  Info = 1,
  Warn = 2,
  Error = 3,
}

/**
 * Central logging surface for the app. In production builds, Debug/Info are
 * suppressed so the console only carries Warn/Error, while still funnelling
 * through one place that could later ship logs to a remote sink.
 */
@Injectable({ providedIn: 'root' })
export class LoggerService {
  private readonly minLevel = isDevMode() ? LogLevel.Debug : LogLevel.Warn;

  debug(message: string, ...context: unknown[]): void {
    this.write(LogLevel.Debug, message, context);
  }

  info(message: string, ...context: unknown[]): void {
    this.write(LogLevel.Info, message, context);
  }

  warn(message: string, ...context: unknown[]): void {
    this.write(LogLevel.Warn, message, context);
  }

  error(message: string, ...context: unknown[]): void {
    this.write(LogLevel.Error, message, context);
  }

  private write(level: LogLevel, message: string, context: unknown[]): void {
    if (level < this.minLevel) return;

    const prefix = `[${LogLevel[level]}]`;
    switch (level) {
      case LogLevel.Debug:
        console.debug(prefix, message, ...context);
        break;
      case LogLevel.Info:
        console.info(prefix, message, ...context);
        break;
      case LogLevel.Warn:
        console.warn(prefix, message, ...context);
        break;
      case LogLevel.Error:
        console.error(prefix, message, ...context);
        break;
    }
  }
}
