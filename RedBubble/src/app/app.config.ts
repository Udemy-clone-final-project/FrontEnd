import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import {
  provideHttpClient,
  withInterceptorsFromDi,
  withInterceptors,
} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { routes } from './app.routes';
import { authInterceptor } from './Services/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    importProvidersFrom(FormsModule, ReactiveFormsModule),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([authInterceptor])
    ),
  ],
};
