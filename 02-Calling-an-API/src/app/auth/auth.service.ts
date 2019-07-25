import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import * as config from '../../../auth_config.json';
import { from, of, Observable, BehaviorSubject, combineLatest, throwError } from 'rxjs';
import { tap, catchError, concatMap, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Create an observable of Auth0 instance of client
  auth0Client$ = (from(
    createAuth0Client({
      domain: config.domain,
      client_id: config.clientId,
      redirect_uri: `${window.location.origin}/callback`,
      audience: config.audience
    })
  ) as Observable<Auth0Client>).pipe(
    shareReplay(1), // Every subscription receives the same shared value
    catchError(err => throwError(err))
  );
  // Define observables for SDK methods that return promises by default
  // For each Auth0 SDK method, first ensure the client instance is ready
  // concatMap: Using the client instance, call SDK method; SDK returns a promise
  // from: Convert that resulting promise into an observable
  isAuthenticated$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.isAuthenticated()))
  );
  getTokenSilently$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.getTokenSilently()))
  );
  handleRedirectCallback$ = this.auth0Client$.pipe(
    concatMap((client: Auth0Client) => from(client.handleRedirectCallback()))
  );
  // Create subject and public observable of user profile data
  private userProfileSubject$ = new BehaviorSubject<any>(null);
  userProfile$ = this.userProfileSubject$.asObservable();
  // Create subject and public observable of access token
  private accessTokenSubject$ = new BehaviorSubject<string>(null);
  accessToken$ = this.accessTokenSubject$.asObservable();
  // Create a local property for login status
  loggedIn: boolean = null;

  constructor(private router: Router) { }

  // getUser$() is a method because options can be passed if desired
  // https://auth0.github.io/auth0-spa-js/classes/auth0client.html#getuser
  getUser$(options?): Observable<any> {
    return this.auth0Client$.pipe(
      concatMap((client: Auth0Client) => from(client.getUser(options)))
    );
  }

  localAuthSetup() {
    // This should only be called on app initialization
    // Set up local authentication streams
    const checkAuth$ = this.isAuthenticated$.pipe(
      concatMap((loggedIn: boolean) => {
        if (loggedIn) {
          // If authenticated, return stream that emits user object and token
          return combineLatest(
            this.getUser$(),
            this.getTokenSilently$
          );
        }
        // If not authenticated, return stream that emits 'false'
        return of(loggedIn);
      })
    );
    const checkAuthSub = checkAuth$.subscribe((response: any[] | boolean) => {
      // If authenticated, response will be array of user object and token
      // If not authenticated, response will be 'false'
      // Set subjects appropriately
      if (response) {
        const user = response[0];
        const token = response[1];
        this.userProfileSubject$.next(user);
        this.accessTokenSubject$.next(token);
      }
      this.loggedIn = !!response;
      // Clean up subscription
      checkAuthSub.unsubscribe();
    });
  }

  login(redirectPath: string = '/') {
    // A desired redirect path can be passed to login method
    // (e.g., from a route guard)
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log in
      client.loginWithRedirect({
        redirect_uri: `${window.location.origin}/callback`,
        appState: { target: redirectPath }
      });
    });
  }

  handleAuthCallback() {
    // Only the callback component should call this method
    // Call when app reloads after user logs in with Auth0
    let targetRoute: string; // Path to redirect to after login processsed
    // Ensure Auth0 client instance exists
    const authComplete$ = this.auth0Client$.pipe(
      // Have client, now call method to handle auth callback redirect
      concatMap(() => this.handleRedirectCallback$),
      tap(cbRes => {
        // Get and set target redirect route from callback results
        targetRoute = cbRes.appState && cbRes.appState.target ? cbRes.appState.target : '/';
      }),
      concatMap(() => {
        // Redirect callback complete; create stream returning
        // user data, token, and authentication status
        return combineLatest(
          this.getUser$(),
          this.getTokenSilently$,
          this.isAuthenticated$
        );
      })
    );
    // Subscribe to authentication completion observable
    // Response will be an array of user, token, and login status
    authComplete$.subscribe(([user, token, loggedIn]) => {
      // Update subjects and loggedIn property
      this.userProfileSubject$.next(user);
      this.accessTokenSubject$.next(token);
      this.loggedIn = loggedIn;
      // Redirect to target route after callback processing
      this.router.navigate([targetRoute]);
    });
  }

  logout() {
    // Ensure Auth0 client instance exists
    this.auth0Client$.subscribe((client: Auth0Client) => {
      // Call method to log out
      client.logout({
        client_id: config.clientId,
        returnTo: window.location.origin
      });
    });
  }

}
