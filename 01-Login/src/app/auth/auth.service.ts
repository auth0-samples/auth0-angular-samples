import { Injectable } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import * as config from '../../../auth_config.json';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = new BehaviorSubject(false);
  profile = new BehaviorSubject<any>(null);

  private auth0Client: Auth0Client;

  config = config;

  async getAuth0Client(): Promise<Auth0Client> {
    if (!this.auth0Client) {
      this.auth0Client = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId,
        redirect_uri: `${window.location.origin}/callback`
      });

      try {
        this.isAuthenticated.next(await this.auth0Client.isAuthenticated());

        this.isAuthenticated.subscribe(async isAuthenticated => {
          if (isAuthenticated) {
            return this.profile.next(await this.auth0Client.getUser());
          }

          this.profile.next(null);
        });
      } catch {}

      return this.auth0Client;
    }

    return this.auth0Client;
  }
}
