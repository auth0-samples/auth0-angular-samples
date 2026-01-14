import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
/* highlight-start import-provide-auth0 */
import { provideAuth0 } from '@auth0/auth0-angular';
/* highlight-end import-provide-auth0 */

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    /* highlight-start provider-config */
    provideAuth0({
      domain: window.AUTH0_DOMAIN,
      clientId: window.AUTH0_CLIENT_ID,
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
    /* highlight-end provider-config */
  ],
};
