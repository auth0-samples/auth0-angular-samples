import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  shouldDisplayOverlay: boolean = true;

  constructor(public auth: AuthService) {
    auth.handleAuthentication();

    // Attempt single sign-on authentication
    // if not authenticated
    if (auth.isAuthenticated()) {
      this.shouldDisplayOverlay = false;
    } else {
      auth.renewToken();
    }
    // Hide the overlay when single sign-on auth is complete
    auth.ssoAuthComplete$.subscribe(
      status => this.shouldDisplayOverlay = !status
    );
  }
}
