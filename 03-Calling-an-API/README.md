# LoginDemo

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

## Development server

Run `npm run dev` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

This will automatically start a Node + Express server as the backend on port 3001. THe Angular application is configured to proxy through to this on any `/api` route.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `npm build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `npm test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `npm e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Tutorial: Calling an API Using Access Tokens

Most single-page apps use resources from data APIs. You may want to restrict access to those resources, so that only authenticated users with sufficient privileges can access them. Auth0 lets you manage access to these resources using [API Authorization](/api-auth).

This tutorial shows you how to create a simple API using [Express](https://expressjs.com) that validates incoming JSON Web Tokens. You will then see how to call this API using an Access Token granted by the Auth0 authorization server.

## Create an API

In the [APIs section](${manage_url}/#/apis) of the Auth0 dashboard, click **Create API**. Provide a name and an identifier for your API. You will use the identifier later when you're configuring your Javascript Auth0 application instance.
For **Signing Algorithm**, select **RS256**.

![Creating an API](https://cdn.auth0.com/blog/angular-quickstart:api.png)

## Create the Backend API

For this example, you'll create an [Express](https://expressjs.com/) server that acts as the backend API. This API will expose an endpoint to validate incoming ID Tokens before returning a response.

Start by installing the following packages:

```bash
npm install express express-jwt jwks-rsa npm-run-all
```

- [`express`](https://github.com/expressjs/express) - a lightweight web server for Node
- [`express-jwt`](https://www.npmjs.com/package/express-jwt) - middleware to validate JsonWebTokens
- [`jwks-rsa`](https://www.npmjs.com/package/jwks-rsa) - retrieves RSA signing keys from a JWKS endpoint
- [`npm-run-all`](https://www.npmjs.com/package/npm-run-all) - a helper to run the SPA and backend API concurrently

Next, create a new file `server.js` in the root of the project with the following code:

```js
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const authConfig = require('./auth_config.json');

// Create a new Express app
const app = express();

// Define middleware that validates incoming bearer tokens
// using JWKS from ${account.tenant}
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://<%= "${authConfig.domain}" %>/.well-known/jwks.json`
  }),

  audience: authConfig.audience,
  issuer: `https://<%= "${authConfig.domain}" %>/`,
  algorithm: ['RS256']
});

// Define an endpoint that must be called with an access token
app.get('/api/external', checkJwt, (req, res) => {
  res.send({
    msg: 'Your Access Token was successfully validated!'
  });
});

// Start the app
app.listen(3001, () => console.log('API listening on 3001'));
```

The above API has one available endpoint, `/api/external`, that returns a JSON response to the caller. This endpoint uses the `checkJwt` middleware to validate the supplied bearer token using your tenant's [JSON Web Key Set](https://auth0.com/docs/jwks). If the token is valid, the request is allowed to continue. Otherwise, the server returns a 401 Unauthorized response.

Finally, modify `package.json` to add two new scripts `dev` and `server` that can be used to start the frontend and the backend API together:

```json
"scripts": {
  "ng": "ng",
  "start": "ng serve --host 0.0.0.0 --port 3000",
  "build": "ng build",
  "test": "ng test",
  "lint": "ng lint",
  "e2e": "ng e2e",
  "server": "node server.js",
  "dev": "npm-run-all --parallel start server"
},
```

### Set up a proxy to the backend API

In order to call the API from the frontend application, the development server must be configured to proxy requests through to the backend API. To do this, add a `proxy.conf.json` file to the root of the project and populate it with the following code:

```json
{
  "/api": {
    "target": "http://localhost:3001",
    "secure": false
  }
}
```

Finally, modify `angular.json` to include a reference to this proxy configuration file. Open `angular.json` and look for the `serve` node. Modify it to include a reference to the proxy config file:

```json
"serve": {
  "builder": "@angular-devkit/build-angular:dev-server",
  "options": {
    "browserTarget": "login-demo:build",
    "proxyConfig": "proxy.conf.json"
  },
  "configurations": {
    "production": {
      "browserTarget": "login-demo:build:production"
    }
  }
},
```

With this in place, the frontend application can make a request to `/api/external` and it will be correctly proxied through to the backend API at `http://localhost:3001/api/external`.

## Modify the AuthService Class

First of all, open `auth_config.json` in the root of the project and make sure that a value for `audience` is exported along with the other settings:

```json
{
  "domain": "{YOUR AUTH0 DOMAIN}",
  "clientId": "{YOUR AUTH0 CLIENT ID}",
  "audience": "{YOUR API AUDIENCE}"
}
```

Next, modify the `src/app/auth/auth.service.ts` file so that the `audience` value is passed through to the Auth0 client:

```js
// src/app/auth/auth.service.ts

this.auth0Client = await createAuth0Client({
  domain: config.domain,
  client_id: config.clientId,
  audience: config.audience // NEW - add in the audience value
});
```

Now add a new `BehaviorSubject` to this class that can store the access token:

```js
// src/app/auth/auth.service.ts

isAuthenticated = new BehaviorSubject(false);
profile = new BehaviorSubject<any>(null);

// NEW - add a BehaviorSubject for the token
token = new BehaviorSubject<string>(null);
```

Further down the file, modify the `getAuth0Client` function so that the token is set when it is retrieved from the Auth0 client:

```js
this.token.next(await this.auth0Client.getTokenSilently());
```

Once all of the changes are made, your `AuthService` file might look something like the following:

```js
// src/app/auth/auth.service.ts

import { Injectable, OnInit } from '@angular/core';
import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/src/Auth0Client';
import * as config from '../../../auth_config.json';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated = new BehaviorSubject(false);
  profile = new BehaviorSubject<any>(null);
  token = new BehaviorSubject<string>(null);

  private auth0Client: Auth0Client;

  async getAuth0Client(): Promise<Auth0Client> {
    if (!this.auth0Client) {
      this.auth0Client = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId,
        audience: config.audience
      });

      try {
        this.token.next(await this.auth0Client.getTokenSilently());

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
```

## Calling the API

Now create a new component that can be shown on the screen to allow the user to call the backend API:

```bash
ng generate component external-api
```

Open `src/app/external-api/external-api.component.html` and replace its contents with the following:

```html
<!-- src/app/external-api/external-api.component.html -->

<div>
  <button (click)="pingApi()">Ping API</button>

  <div>
    <div [ngClass]="{ show: hasResponse }">
      <h6 class="muted">Result</h6>
      <pre>
        <code [highlight]="responseJson"></code>
      </pre>
    </div>
  </div>
</div>
```

The UI for this component is a simple button that invokes a call to the API. The results of the call are then displayed in the `code` element.

Next, open `src/app/external-api/external-api.component.ts` and replace its contents with the following:

```js
// src/app/external-api/external-api.component.ts

import { Component, OnInit } from '@angular/core';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/src/Auth0Client';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-external-api',
  templateUrl: './external-api.component.html',
  styleUrls: ['./external-api.component.css']
})
export class ExternalApiComponent implements OnInit {
  client: Auth0Client;
  responseJson: string;
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
      });
  }
}
```

- The `ngOnInit` function here is responsible for retrieving the access token from the authentication service, by _subscribing_ to the `token` BehaviourSubject
- The `pingApi` function uses [Angular's HttpClient](https://angular.io/guide/http) to make a call to the backend server. It attaches the bearer token to the `Authorization` header so that the request may be authorized

With this in place, modify the application router so that this new page can be accessed. Open the `src/app/app-routing.module.ts` file and modify the routes list to include the new component for calling the API:

```js
// src/app/app-routing.module.ts

// .. other imports

import { ExternalApiComponent } from './external-api/external-api.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'login',
    children: [],
    canActivate: [LoginGuard]
  },

  // NEW - add a route to the External API component
  {
    path: 'external-api',
    component: ExternalApiComponent,
    canActivate: [LoginGuard]
  }
];
```

Finally, add a link to the navigation bar so that the user may reach this new page. Open `src/app/navbar/navbar.component.html` and modify it to include a link to the `/external-api` route:

```html
<header>
  <button (click)="login()" *ngIf="!isAuthenticated">Log in</button>
  <button (click)="logout()" *ngIf="isAuthenticated">Log out</button>

  <!-- NEW - add a couple of router links to the home page, and to profile -->
  <a [routerLink]="['']">Home</a>&nbsp;
  <a [routerLink]="['profile']" *ngIf="isAuthenticated">Profile</a>
  <a [routerLink]="['external-api']" *ngIf="isAuthenticated">External API</a>
</header>
```

At this point, you should be able to run the application, browse to the External API page and click the **Ping API** button to initiate the API call. The results of that call should then be available in the browser.
