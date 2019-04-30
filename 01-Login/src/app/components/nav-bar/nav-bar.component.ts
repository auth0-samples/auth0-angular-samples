import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/src/Auth0Client';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isAuthenticated = false;
  isCollapsed = true;
  profile: any;

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

  logout() {
    this.auth0Client.logout();
  }
}
