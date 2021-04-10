import { domain, clientId, audience, apiUri, errorPath } from '../../auth_config.json';

export const environment = {
  production: true,
  auth: {
    domain,
    clientId,
    audience,
    redirectUri: window.location.origin,
    errorPath,
  },
  httpInterceptor: {
    allowedList: [`${apiUri}/*`],
  },
};
