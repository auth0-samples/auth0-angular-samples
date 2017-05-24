import { Injectable } from '@angular/core';
import { AUTH_CONFIG } from './auth0-variables';
import { Router } from '@angular/router';
import 'rxjs/add/operator/filter';
import auth0 from 'auth0-js';

@Injectable()
export class AuthService {

  userProfile: any;
  timeoutId: any;

  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    audience: AUTH_CONFIG.apiUrl,
    redirectUri: AUTH_CONFIG.callbackURL,
    scope: 'openid profile'
  });

  constructor(public router: Router) {
    // run this here as well, just to account for situations where you'd already be logged in
    this.scheduleRenewal();
  }

  public login(): void {
    this.auth0.authorize();
  }

  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/home']);
      } else if (err) {
        this.router.navigate(['/home']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  public getProfile(cb): void {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
      throw new Error('Access token must exist to fetch profile');
    }

    const self = this;
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        self.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + Date.now());

    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    this.scheduleRenewal();
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

  public renew() {
    this.auth0.renewAuth({
      audience: AUTH_CONFIG.apiUrl,
      redirectUri: 'http://localhost:3001/silent',
      usePostMessage: true
    }, (err, result) => {
      if (err) {
        alert(`Could not get a new token using silent authentication (${err.error}). Re-attempting login...`);
        this.login();
      } else {
        alert(`Successfully renewed auth!`);
        this.setSession(result);
      }
    });
  }

  public scheduleRenewal() {
    if(this.timeoutId) clearTimeout(this.timeoutId);

    const now = Date.now();
    const expiresAt = JSON.parse(window.localStorage.getItem('expires_at'));

    // if there is no expiresAt, there's no reason to schedule a renewal
    if(!expiresAt) return;

    this.timeoutId = setTimeout(() => {
      this.renew();
    }, Math.max(1, expiresAt - now));
  }

}

