# Auth0 Angular Authorization

This sample demonstrates how to include user authorization in an Angular application with Auth0. The sample uses the Angular CLI.

## Getting Started

If you haven't already done so, [sign up](https://auth0.com) for your free Auth0 account and create a new client in the [dashboard](https://manage.auth0.com). Find the **domain** and **client ID** from the settings area and add the URL for your application to the **Allowed Callback URLs** box. If you are using the server provided by the Angular CLI, that URL is `http://localhost:3000/callback`.

You must ensure that the APIs section is enabled in your Auth0 dashboard. To do so, go to the [Advanced Settings](https://manage.auth0.com/#/account/advanced) area and verify that **Enable APIs Section** is switched on. Next, navigate to APIs in the sidebar and create a new API. The identifier for your API will be required later.

Clone the repo or download it from the Angular quickstart page in Auth0's documentation. Install the Angular CLI and the dependencies for the app.

```bash
npm install -g @angular/cli
cd 04-Authorization
npm install
```

## Set the Client ID, Domain, and API URL

If you download the sample from the quickstart page, it will come pre-populated with the **client ID** and **domain** for your application. If you clone the repo directly from Github, rename the `auth0-variables.ts.example` file to `auth0-variables.ts` and provide the **client ID** and **domain** there. This file is located in `src/app/auth/`.

You should also provide the identifier for the API you create in the Auth0 dashboard as your `apiUrl`.

## Set Up the `.env` File

In addition to the above-mentioned `auth0-variables.ts` file, a `.env` file is provided at the root of the application. This file provides your application's credentials to the small Node server located in `server.js`.

This file has two values, `AUTH0_AUDIENCE` and `AUTH0_DOMAIN`. If you download this sample from the quickstart page, the value for `AUTH0_DOMAIN` will be populated automatically, but you will still need to populate `AUTH0_AUDIENCE` manually. The value for `AUTH0_AUDIENCE` is the identifier used for an API that you create in the Auth0 dashboard.

## Run the Application

The development server that comes with the Angular CLI can be used to serve the application.

```bash
npm start
```

The application will be served at `http://localhost:3000`.

> **Note:** The default Angular CLI port is `4200`, but Auth0 samples use port `3000` instead.

## Run the Application With Docker

In order to run the example with docker you need to have `docker` installed.

You also need to set the environment variables as explained [previously](#set-the-client-id-domain-and-api-url).

Execute in command line `sh exec.sh` to run the Docker in Linux, or `.\exec.ps1` to run the Docker in Windows.

## Tutorial

## Access Control in Single-Page Applications

In Single-Page Applications you use Access Control to define what different users can see, and which routes they can access.
With Auth0, you can implement access control by using scopes granted to users.

To set up access control in your application, enforce the following restrictions:

- The data from an API can only be returned if the user is authorized to access it. This needs to be done when implementing the API.
- The user can access specific routes and UI elements in your application only if they have the appropriate access level.

The previous step used the `read:messages` scope for accessing API resources. This scope indicates that the user can only view the data. You can consider users with this scope regular users. If you want to give some users permission to edit the data, you can add the `write:messages` scope.

> **Note:**Read about naming scopes and mapping them to access levels in the [Scopes documentation](https://auth0.com/docs/scopes). To learn more about custom scope claims, follow the [User profile claims and scope tutorial](https://auth0.com/docs/api-auth/tutorials/adoption/scope-custom-claims).

### Determine a User's Scopes

You can use scopes to make decisions about the behavior of your application's interface.

You can specify which scopes you want to request at the beginning of the login process.

If a scope you requested is available to the user, their Access Token receives a `scope` claim in the payload. The value of this claim is a string with all the granted scopes, but your application must treat the Access Token as opaque and must not decode it. This means that you cannot read the Access Token to access the scopes.

To get the scopes, you can use the value of the `scope` parameter that comes back after authentication. This parameter is a string containing all the scopes granted to the user, separated by spaces. This parameter will be populated only if the scopes granted to the user are different than those you requested.

To see which scopes are granted to the user, check for the value of `authResult.scope`. If there is no value for `authResult.scope`, all the requested scopes were granted.

## Handle Scopes in the `AuthService` Service

Add a local member to your `AuthService` service and initialize it with all the scopes you want to request when users log in. Use this member when initializing your instance of the `auth0.WebAuth` object.

```ts
// src/app/auth/auth.service.ts

private _scopes: string;

requestedScopes: string = 'openid profile read:messages write:messages';

auth0 = new auth0.WebAuth({
  // ...
  scope: this.requestedScopes
});
```

Add a `setSession` method to save the scopes granted to the user into browser storage.

First, check for the scopes in the `scope` key from `authResult`. If it's not empty, the user was granted a different set of scopes than the one the application requested, so you need to use the ones in `authResult.scope`.

If it's empty, all the scopes requested were granted, so you can use the values from the variable that stores the requested scopes.

```ts
// src/app/auth/auth.service.ts

private localLogin(authResult): void {

  const scopes = authResult.scope || this.requestedScopes || '';

  // ...
  this._scopes = JSON.stringify(scopes);
}
```

Add a method called `userHasScopes` that checks for scopes in local storage. You can use this method to conditionally hide and show UI elements to the user and to limit route access.

```ts
// src/app/auth/auth.service.ts

public userHasScopes(scopes: Array<string>): boolean {
  const grantedScopes = JSON.parse(this._scopes).split(' ');
  return scopes.every(scope => grantedScopes.includes(scope));
}
```

## Conditionally Display UI Elements

You can use the `userHasScopes` method with the `isAuthenticated` method to show and hide certain UI elements.

```html
<!-- src/app/app.component.html -->

<button
  class="btn btn-primary btn-margin"
  *ngIf="auth.isAuthenticated() && auth.userHasScopes(['write:messages'])"
  routerLink="/admin"
>
  Admin Area
</button>
```

## Protect Client-Side Routes

You may want to give access to some routes in your application only to authenticated users. You can check if the user is authenticated with the `canActivate` hook.

Create a new service called `AuthGuardService`.

```ts
// src/app/auth/auth-guard.service.ts

import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate([""]);
      return false;
    }
    return true;
  }
}
```

In your route configuration, apply the `AuthGuardService` service to the `canActivate` hook for any routes you want to protect.

```ts
// src/app/app.routes.ts

import { AuthGuardService as AuthGuard } from "./auth/auth-guard.service";

export const ROUTES: Routes = [
  // ...
  { path: "profile", component: ProfileComponent, canActivate: [AuthGuard] },
  { path: "ping", component: PingComponent, canActivate: [AuthGuard] }
];
```

The guard implements the `CanActivate` interface which requires the `canActivate` method in the service. This method returns `true` if the user is authenticated and `false` if they are not. It also navigates the user to the home route if they are not authenticated.

### Limit Route Access Based on Scopes

To prevent access to client-side routes based on a scope, create a service called `ScopeGuard`. This service uses Angular's `ActivatedRouteSnapshot` to check for a set of `expectedScopes` passed in the `data` key of the route configuration.

If the user does not have the `write:messages` scope, they are redirected to the main route.

```ts
// src/app/auth/scope-guard.service.ts

import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "./auth.service";

@Injectable()
export class ScopeGuardService implements CanActivate {
  constructor(public auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const scopes = (route.data as any).expectedScopes;

    if (!this.auth.isAuthenticated() || !this.auth.userHasScopes(scopes)) {
      this.router.navigate([""]);
      return false;
    }
    return true;
  }
}
```

```ts
// src/app/app.routes.ts

import { ScopeGuardService as ScopeGuard } from "./auth/scope-guard.service";

export const ROUTES: Routes = [
  // ...
  {
    path: "admin",
    component: AdminComponent,
    canActivate: [ScopeGuard],
    data: { expectedScopes: ["write:messages"] }
  }
];
```

## Conditionally Assign Scopes to Users

By default, when you register scopes in your API settings, all the scopes are immediately available and any user can request them.
If you want to handle access control, you need to create policies for deciding which users can get which scopes.

> **Note:** You can use Rules to create access policies. See the [Rules documentation](https://auth0.com/docs/rules) to learn how to use Rules to create scope policies.

### Considerations for Client-Side Access Control

For the access control on the application-side, the `scope` values that you get in local storage are only a clue that the user has those scopes. The user could manually adjust the scopes in local storage to access routes they shouldn't have access to.

On the other hand, to access data on your server, the user needs a valid Access Token. Any attempt to modify an Access Token invalidates the token. If a user tries to edit the payload of their Access Token to include different scopes, the token will lose its integrity and become useless.

You should not store your sensitive data application-side. Make sure you always request it from the server. Even if users manually navigate to a page they are not authorized to see, they will not get the relevant data from the server and your application will still be secure.

## What is Auth0?

Auth0 helps you to:

aa-\* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.

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
