import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/src/Auth0Client';
import * as config from '../../../auth_config.json';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth0Client: Auth0Client;

  constructor() {}

  async getAuth0Client(): Promise<Auth0Client> {
    if (!this.auth0Client) {
      this.auth0Client = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId
      });

      return this.auth0Client;
    }

    return Promise.resolve(this.auth0Client);
  }
}
