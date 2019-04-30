import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/src/Auth0Client';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-external-api',
  templateUrl: './external-api.component.html',
  styleUrls: ['./external-api.component.css']
})
export class ExternalApiComponent implements OnInit {
  client: Auth0Client;
  responseJson: string;
  hasResponse = false;
  token: string;

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.authService.token.subscribe(token => (this.token = token));
  }

  async pingApi() {
    this.httpClient
      .get('/api/external', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      .subscribe((response: any) => {
        this.responseJson = JSON.stringify(response, null, 2).trim();
        this.hasResponse = true;
      });
  }
}
