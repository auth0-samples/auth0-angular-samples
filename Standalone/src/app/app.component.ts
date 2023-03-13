import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { FooterComponent } from './components/footer/footer.component';
import { filter, mergeMap } from 'rxjs/operators';
import { AuthService, GenericError } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, NavBarComponent, FooterComponent],
})
export class AppComponent {
  title = 'Auth0 Angular SDK Sample';

  constructor(private readonly auth: AuthService) {}

  ngOnInit(): void {
    this.auth.error$
      .pipe(
        filter(
          (e) => e instanceof GenericError && e.error === 'login_required'
        ),
        mergeMap(() => this.auth.loginWithRedirect())
      )
      .subscribe();
  }
}
