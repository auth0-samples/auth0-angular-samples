import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { AUTH_CONFIG } from './auth0-variables';
import 'rxjs/add/operator/filter';
import Auth0Lock from 'auth0-lock';
import jwt_decode from 'jwt-decode';

@Injectable()
export class AuthService {

  lock = new Auth0Lock(AUTH_CONFIG.clientID, AUTH_CONFIG.domain, {
    oidcConformant: true,
    autoclose: true,
    auth: {
      audience: AUTH_CONFIG.apiUrl,
      redirectUrl: AUTH_CONFIG.callbackURL,
      responseType: 'token id_token',
      params: {
        scope: 'openid profile read:messages'
      }
    }
  });

  userProfile: any;

  constructor(private router: Router) {}

  public login(): void {
    this.lock.show();
  }

  // Call this method in app.component
  // if using path-based routing
  public handleAuthentication(): void {
    this.lock.on('authenticated', (authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        this.router.events
          .filter(event => event instanceof NavigationStart)
          .filter((event: NavigationStart) => event.url === '/callback')
          .subscribe(() => {
            this.router.navigate(['/']);
          });
      } else if (authResult && authResult.error) {
        alert(`Error: ${authResult.error}`);
      }
    });
  }

  // Call this method in app.component
  // if using hash-based routing
  public handleAuthenticationWithHash(): void {
    this
      .router
      .events
      .filter(event => event instanceof NavigationStart)
      .filter((event: NavigationStart) => (/access_token|id_token|error/).test(event.url))
      .subscribe(() => {
        this.lock.resumeAuth(window.location.hash, (error, authResult) => {
          if (error) {
            return console.log(error);
          }
          this.setSession(authResult);
          this.router.navigate(['/']);
        });
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  public getProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    const self = this;
    this.lock.getUserInfo(accessToken, function(err, profile) {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  getRole(): string {
    const namespace = 'https://example.com';
    const idToken = localStorage.getItem('id_token');
    return jwt_decode(idToken)[`${namespace}/role`] || null;
  }

  isAdmin(): boolean {
    return this.getRole() === 'admin';
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    this.userProfile = null;
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

}
