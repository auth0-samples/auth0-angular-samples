import { domain, clientId, audience } from '../../auth_config.json';

export const environment = {
  production: true,
  auth: {
    domain,
    clientId,
    audience,
    redirectUri: window.location.origin,
  },
  httpInterceptor: {
    allowedList: ['/api/external'],
  },
};
