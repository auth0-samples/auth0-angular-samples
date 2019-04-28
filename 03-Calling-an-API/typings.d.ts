declare module 'auth_config.json' {
  const config: AuthConfig;
  export default config;
}

/**
 * Type declaration for the auth_config.json contents
 */
type AuthConfig = {
  clientId: string;
  domain: string;
};
