import { importProvidersFrom, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { routes } from './app/app-routing.module';
import { AuthHttpInterceptor, AuthModule } from '@auth0/auth0-angular';
import { environment as env } from './environments/environment';
import {
  HttpHandlerFn,
  HttpRequest,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import { provideRouter } from '@angular/router';

const authInterceptor = (req: HttpRequest<any>, handle: HttpHandlerFn) =>
  inject(AuthHttpInterceptor).intercept(req, { handle });

bootstrapApplication(AppComponent, {
  providers: [
    AuthHttpInterceptor,
    provideHttpClient(withInterceptors([authInterceptor])),
    provideRouter(routes),
    importProvidersFrom(
      AuthModule.forRoot({
        ...env.auth,
        httpInterceptor: {
          ...env.httpInterceptor,
        },
      })
    ),
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        coreLibraryLoader: () => import('highlight.js/lib/core'),
        languages: {
          json: () => import('highlight.js/lib/languages/json'),
        },
      },
    },
  ],
});
