import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/* highlight-start import-auth0 */
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
/* highlight-end import-auth0 */

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  // highlight-start auth0-usage
  template: `
    <main>
      @if (auth.isLoading$ | async) { Loading... } @else if (auth.isAuthenticated$ | async) { @if
      (auth.user$ | async; as user) {
      <p>Logged in as {{ user.email }}</p>
      <h1>User Profile</h1>
      <pre>{{ user | json }}</pre>
      <button (click)="auth.logout()">Logout</button>
      } } @else {
      <button (click)="auth.loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })">
        Sign Up
      </button>
      <button (click)="auth.loginWithRedirect()">Log In</button>
      }
      <router-outlet />
    </main>
  `,
  // highlight-end auth0-usage
})
export class App {
  protected auth = inject(AuthService);
}
