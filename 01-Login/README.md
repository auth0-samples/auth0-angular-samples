# Auth0 Angular Login

This sample demonstrates how to add authentication to an Angular application using Auth0's Lock widget from the hosted login page. The sample uses the Angular CLI.

## Getting Started

If you haven't already done so, [sign up](https://auth0.com) for your free Auth0 account and create a new client in the [dashboard](https://manage.auth0.com). Find the **domain** and **client ID** from the settings area and add the URL for your application to the **Allowed Callback URLs** box. If you are using the server provided by the Angular CLI, that URL is `http://localhost:3000/callback`.

Clone the repo or download it from the Angular quickstart page in Auth0's documentation. Install the Angular CLI and the dependencies for the app.

```bash
npm install -g @angular/cli
cd 01-Login
npm install
```

## Set the Client ID and Domain

If you download the sample from the quickstart page, it will come pre-populated with the **client ID** and **domain** for your application. If you clone the repo directly from Github, rename the `auth0-variables.ts.example` file to `auth0-variables.ts` and provide the **client ID** and **domain** there. This file is located in `src/app/auth/`.

## Run the Application

The development server that comes with the Angular CLI can be used to serve the application.

```bash
npm start
```

The application will be served at `http://localhost:3000`.

> **Note:** The default Angular CLI port is `4200`, but Auth0 samples use port `3000` instead.

## Run the Application With Docker

In order to run the example with docker you need to have `docker` installed.

You also need to set the environment variables as explained [previously](#set-the-client-id-and-domain).

Execute in command line `sh exec.sh` to run the Docker in Linux, or `.\exec.ps1` to run the Docker in Windows.

## Tutorial

### Create an Authentication Service

Create a service to manage and coordinate user authentication. You can give the service any name. In the examples below, the service is `AuthService` and the filename is `auth.service.ts`.

In the service add an instance of the `auth0.WebAuth` object. When creating that instance, you can specify the following:

- Configuration for your application and domain
- Response type, to show that you need a user's Access Token and an ID Token after authentication
- Audience and scope, specifying that you need an `access_token` that can be used to invoke the [/userinfo endpoint](https://auth0.com/docs/api/authentication#get-user-info).
- The URL where you want to redirect your users after authentication.

> **Note:** In this tutorial, the route is `/callback`, which is implemented in the [Add a Callback Component](#add-a-callback-component) step.

Add `_idToken`, `_accessToken`, `_expiresAt` properties to `AuthService` Class to store the ID Token, Access Token and Access Token's expiry time respectively. This values will be populated on successful auth. Add the getters for the ID Token and the Access Token.

Add a `login` method that calls the `authorize` method from auth0.js.

```ts
// src/app/auth/auth.service.ts

import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import * as auth0 from "auth0-js";

@Injectable()
export class AuthService {
  private _idToken: string;
  private _accessToken: string;
  private _expiresAt: number;

  auth0 = new auth0.WebAuth({
    clientID: "YOUR AUTH0 CLIENT ID",
    domain: "YOUR AUTH0 DOMAIN",
    responseType: "token id_token",
    redirectUri: "http://localhost:3000/callback",
    scope: "openid"
  });

  constructor(public router: Router) {
    this._idToken = "";
    this._accessToken = "";
    this._expiresAt = 0;
  }

  get accessToken(): string {
    return this._accessToken;
  }

  get idToken(): string {
    return this._idToken;
  }

  public login(): void {
    this.auth0.authorize();
  }
}
```

> **Note:** **Checkpoint:** Try to call the `login` method from somewhere in your application to see the login page. For example, you can trigger the method from a button click or a lifecycle event.

### Finish the Service

Add more methods to the `AuthService` service to handle authentication in the app.

The example below shows the following methods:

- `handleAuthentication`: looks for the result of authentication in the URL hash. Then, the result is processed with the `parseHash` method from auth0.js.
- `localLogin`: stores the user's Access Token, ID Token, and the Access Token's expiry time in `AuthService` properties.
- `renewTokens`: performs silent authentication to renew the session.
- `logout`: removes the user's tokens and expiry time from `AuthService` properties.
- `isAuthenticated`: checks whether the user's Access Token is set and its expiry time has passed.

```ts
// src/app/auth/auth.service.ts

// ...
@Injectable()
export class AuthService {
  // ...
  public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = "";
        this.localLogin(authResult);
        this.router.navigate(["/home"]);
      } else if (err) {
        this.router.navigate(["/home"]);
        console.log(err);
      }
    });
  }

  private localLogin(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = authResult.expiresIn * 1000 + Date.now();
    this._accessToken = authResult.accessToken;
    this._idToken = authResult.idToken;
    this._expiresAt = expiresAt;
  }

  public renewTokens(): void {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.localLogin(authResult);
      } else if (err) {
        alert(
          `Could not get a new token (${err.error}: ${err.error_description}).`
        );
        this.logout();
      }
    });
  }

  public logout(): void {
    // Remove tokens and expiry time
    this._accessToken = "";
    this._idToken = "";
    this._expiresAt = 0;

    this.auth0.logout({
      returnTo: window.location.origin
    });
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    return this._accessToken && Date.now() < this._expiresAt;
  }
}
```

Then add the service `AuthService` in the set of providers in your `@NgModule`.

```ts
// src/app/app.module.ts

// ...
import { AuthService } from "./auth/auth.service";

@NgModule({
  // ...
  providers: [AuthService]
})
```

### Provide a Login Control

Provide a template with controls for the user to log in and out.

```html
<!-- src/app/app.component.html -->

<nav class="navbar navbar-default">
  <div class="container-fluid">
    <div class="navbar-header">
      <a class="navbar-brand" href="#">Auth0 - Angular</a>

      <button class="btn btn-primary btn-margin" routerLink="/">
        Home
      </button>

      <button
        class="btn btn-primary btn-margin"
        *ngIf="!auth.isAuthenticated()"
        (click)="auth.login()"
      >
        Log In
      </button>

      <button
        class="btn btn-primary btn-margin"
        *ngIf="auth.isAuthenticated()"
        (click)="auth.logout()"
      >
        Log Out
      </button>
    </div>
  </div>
</nav>

<main class="container">
  <router-outlet></router-outlet>
</main>
```

> **Note:** This example uses Bootstrap styles. You can use any style library, or not use one at all.

Depending on whether the user is authenticated or not, they see the **Log In** or **Log Out** button. The `click` events on the buttons make calls to the `AuthService` service to let the user log in or out. When the user clicks **Log In**, they are redirected to the login page.

> **Note:** The login page uses the Lock widget. To learn more about Universal Login and the login page, see the [Universal Login documentation](https://auth0.com/docs/hosted-pages/login). To customize the look and feel of the Lock widget, see the [Lock customization options documentation](https://auth0.com/docs/libraries/lock/v10/customization).

### Add a Callback Component

When you use Universal Login, your users are taken away from your application. After they authenticate, they are automatically returned to your application and a client-side session is set for them.

> **Note:** This example assumes you are using the default Angular path-based routing. If you are using hash-based routing with `{ useHash: true }`, you will not be able to specify a dedicated callback route. The URL hash will be used to hold the user's authentication information.

You can select any URL in your application for your users to return to. We recommend creating a dedicated callback route.
If you create a single callback route:

- You don't have to whitelist many, sometimes unknown, callback URLs.
- You can display a loading indicator while the application sets up a client-side session.

Create a component named `CallbackComponent` and add a loading indicator.

> **Note:** To display a loading indicator, you need a loading spinner or another indicator in the `assets` directory. See the downloadable sample for demonstration.

```html
<!-- app/callback/callback.html -->

<div class="loading">
  <img src="assets/loading.svg" alt="loading" />
</div>
```

After authentication, your users are taken to the `/callback` route. They see the loading indicator while the application sets up a client-side session for them. After the session is set up, the users are redirected to the `/home` route.

## Handle Authentication Tokens

When a user authenticates at the login page, they are redirected to your application. Their URL contains a hash fragment with their authentication information. The `handleAuthentication` method in the `AuthService` service processes the hash.

Call the `handleAuthentication` method in your app's root component. The method processes the authentication hash while your app loads.

```ts
// src/app/app.component.ts

import { Component, OnInit } from "@angular/core";
import { AuthService } from "./auth/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  constructor(public auth: AuthService) {
    auth.handleAuthentication();
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.auth.renewTokens();
    }
  }
}
```

## What is Auth0?

Auth0 helps you to:

- Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
- Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
- Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
- Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
- Analytics of how, when and where users are logging in.
- Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free Auth0 account

1. Go to [Auth0](https://auth0.com/signup) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](https://auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.
