import { Injectable } from '@angular/core';
import { tokenNotExpired } from 'angular2-jwt';
import { Router } from '@angular/router';
import { AUTH_CONFIG } from './auth0-variables';

// Avoid name not found warnings
declare var auth0: any;

@Injectable()
export class AuthService {

  // Configure Auth0
  auth0 = new auth0.WebAuth({
    domain: AUTH_CONFIG.domain,
    clientID: AUTH_CONFIG.clientID,
    redirectUri: AUTH_CONFIG.callbackURL,
    responseType: 'token id_token'
  });

  constructor(private router: Router) {

    let authResult = this.auth0.parseHash(window.location.hash);

    if (authResult && authResult.accessToken && authResult.idToken) {
      window.location.hash = '';
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);      
      this.router.navigate(['/home']);
    } else if (authResult && authResult.error) {
      alert(`Error: ${authResult.error}`);
    }
  }
  
  public login(email, password): void {
    this.auth0.redirect.login({
      connection: 'Username-Password-Authentication',
      audience: `https://${AUTH_CONFIG.domain}/userinfo`,
      email,
      password
    }, function(err) {
      if (err) alert(`Error: ${err.description}`);
    });
  }

  public signup(email, password): void {
    this.auth0.signup({
      connection: 'Username-Password-Authentication',
      email,
      password,
    }, function(err) {
      if (err) alert(`Error: ${err.description}`);
    });
  };


  public loginWithGoogle(): void {
    this.auth0.login({
      connection: 'google-oauth2',
    }, function(err) {
      if (err) alert(`Error: ${err.description}`);
    });
  };

  public isAuthenticated(): boolean {
    // Check if there's an unexpired JWT
    // It searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  };

  public logout(): void {
    // Remove token from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
  };
}
