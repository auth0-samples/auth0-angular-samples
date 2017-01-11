import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { AUTH_CONFIG } from './auth0-variables';

// Avoid name not found warnings
declare var Auth0Lock: any;

@Injectable()
export class AuthService {

  lock = new Auth0Lock(AUTH_CONFIG.clientID, AUTH_CONFIG.domain, {
    oidcConformant: true,
    autoclose: true,
    auth: {
      redirectUri: AUTH_CONFIG.callbackURL,
      responseType: 'token id_token',
      audience: `https://${AUTH_CONFIG.domain}/userinfo`
    }
  });

  constructor() {}

  public login(): void {
    this.lock.show();
  }

  public handleAuthentication(): void {
    this.lock.on('authenticated', (authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setUser(authResult);
      } else if (authResult && authResult.error) {
        alert(`Error: ${authResult.error}`);
      }
    });
  }

  public isAuthenticated(): boolean {
    return tokenNotExpired();
  }

  public logout(): void {
    // Remove token from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
  }

  private setUser(authResult): void {
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
  }
}
