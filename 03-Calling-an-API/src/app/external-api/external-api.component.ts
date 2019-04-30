import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
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

  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  async ngOnInit() {
    this.client = await this.authService.getAuth0Client();
  }

  async pingApi() {
    const token = await this.client.getTokenSilently();

    this.httpClient
      .get('/api/external', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .subscribe((response: any) => {
        this.responseJson = JSON.stringify(response, null, 2).trim();
        this.hasResponse = true;
      });
  }
}
