import config from '../../auth_config.json';

const { domain, clientId, audience, apiUri } = config as {
  domain: string;
  clientId: string;
  audience?: string;
  apiUri: string;
};

export const environment = {
  production: true,
  auth: {
    domain,
    clientId,
    ...(audience && audience !== "YOUR_API_IDENTIFIER" ? { audience } : null),
    redirectUri: window.location.origin,
  },
  httpInterceptor: {
    allowedList: [`${apiUri}/*`],
  },
};
