import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/src/Auth0Client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  isAuthenticated = false;
  profile: any;

  private auth0Client: Auth0Client;

  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    this.auth0Client = await this.authService.getAuth0Client();
    this.isAuthenticated = await this.auth0Client.isAuthenticated();

    if (this.isAuthenticated) {
      this.profile = await this.auth0Client.getUser();

      console.log(this.profile);
    }
  }

  async login() {
    this.auth0Client.loginWithRedirect({
      redirect_uri: `${window.location.origin}/callback`
    });
  }
}
