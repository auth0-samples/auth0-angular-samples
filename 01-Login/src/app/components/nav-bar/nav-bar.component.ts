import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import { faUser, faPowerOff } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isAuthenticated = false;
  isCollapsed = true;
  profile: any;
  faUser = faUser;
  faPowerOff = faPowerOff;

  private auth0Client: Auth0Client;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    this.auth0Client = await this.authService.getAuth0Client();

    this.authService.isAuthenticated.subscribe(value => {
      this.isAuthenticated = value;
    });

    this.authService.profile.subscribe(profile => {
      this.profile = profile;
    });
  }

  async login() {
    await this.auth0Client.loginWithRedirect({
      redirect_uri: `${window.location.origin}/callback`
    });
  }

  logout() {
    this.auth0Client.logout({
      client_id: this.authService.config.clientId,
      returnTo: window.location.origin
    });
  }
}
