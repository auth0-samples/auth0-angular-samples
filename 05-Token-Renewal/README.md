# Auth0 Angular Token Renewal

This sample demonstrates how to renew `access_token`s in a Angular application with Auth0 using `checkSession`. For more information, read [our reference documentation](https://auth0.com/docs/libraries/auth0js#using-checksession-to-acquire-new-tokens). The sample uses the Angular CLI.

## Getting Started

Create a new API in the [APIs section](https://manage.auth0.com/#/apis) and provide an identifier for it.

Clone the repo or download it from the Angular quickstart page in Auth0's documentation. Install the Angular CLI and the dependencies for the app.

```bash
npm install -g @angular/cli
cd 05-Token-Renewal
npm install
```

## Set the Client ID, Domain, and API URL

If you download the sample from the quickstart page, it will come pre-populated with the **client ID** and **domain** for your application. If you clone the repo directly from Github, rename the `auth0-variables.ts.example` file to `auth0-variables.ts` and provide the **client ID** and **domain** there. This file is located in `src/app/auth/`.

## Set Up `Allowed Web Origins` in the dashboard

In order to make `checkSession` work, you need to add the URL where the authorization request originates from, to the Allowed Web Origins list of your Auth0 client in the Dashboard under your client's Settings.

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

## Troubleshooting

If you see an error on renewal saying `login_required`, that means you may be using the Auth0 dev keys for whichever social login you're testing. You'll need to add your own keys for this to work.

## Tutorial

### Token Lifetime

For security, keep the expiry time of a user's Access Token short.

When you create an API in the Auth0 dashboard, the default expiry time for browser flows is 7200 seconds (2 hours).

This short expiry time is good for security, but can affect user experience. To improve user experience, provide a way for your users to automatically get a new Access Token and keep their client-side session alive. You can do this with [Silent Authentication](https://auth0.com/docs/api-auth/tutorials/silent-authentication).

> **Note:** You can control the expiry time of an Access Token from the [APIs section](https://manage.auth0.com/#/apis). You can control the expiry time of an ID Token from the [Applications section](https://manage.auth0.com/#/applications). These settings are independent.

## Add Token Renewal

To the `AuthService` service, add a method which calls the `checkSession` method from auth0.js. If the renewal is successful, use the existing `localLogin` method to set the new tokens in memory.

```ts
// src/app/auth/auth.service.ts

public renewTokens() {
  this.auth0.checkSession({}, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      this.localLogin(result);
    }
  });
}
```

Add a method called `scheduleRenewal` to set up the time when authentication is silently renewed.

Define the `refreshSubscription` class property, which will hold a reference to the subscription that refreshes your token.

```ts
// src/app/auth/auth.service.ts
export class AuthService {
  // ..
  // define the refreshSubscription property
  refreshSubscription: any;

  // ...
  public scheduleRenewal() {
    if (!this.isAuthenticated()) {
      return;
    }
    this.unscheduleRenewal();

    const expiresAt = this._expiresAt;

    const expiresIn$ = Observable.of(expiresAt).pipe(
      mergeMap(expiresAt => {
        const now = Date.now();
        // Use timer to track delay until expiration
        // to run the refresh at the proper time
        return Observable.timer(Math.max(1, expiresAt - now));
      })
    );

    // Once the delay time from above is
    // reached, get a new JWT and schedule
    // additional refreshes
    this.refreshSub = expiresIn$.subscribe(() => {
      this.renewTokens();
      this.scheduleRenewal();
    });
  }

  public unscheduleRenewal() {
    if (this.refreshSub) {
      this.refreshSub.unsubscribe();
    }
  }
}
```

This lets you schedule token renewal any time. For example, you can schedule a renewal after the user logs in and then again, if the page is refreshed.

In the `localLogin` method, add the function right after setting the Access Token and ID Token into memory.

```ts
// src/app/auth/auth.service.ts

private localLogin(authResult): void {
  // Set the time that the Access Token will expire at
  const expiresAt = (authResult.expiresIn * 1000) + Date.now();
  this._accessToken = authResult.accessToken;
  this._idToken = authResult.idToken;
  this._expiresAt = expiresAt;

  this.scheduleRenewal();
}
```

Add a call to the `scheduleRenewal` method in the root app component to schedule a renewal when the page is refreshed.

```ts
// src/app/app.component.ts

export class AppComponent {
  constructor(public auth: AuthService) {
    auth.handleAuthentication();
    auth.scheduleRenewal();
  }
}
```

Since client-side sessions should not be renewed after the user logs out, call the `unscheduleRenewal` method in the `logout` method to cancel the renewal.

```ts
// src/app/auth/auth.service.ts

public logout(): void {
  // Remove tokens and expiry time
  this._idToken = '';
  this._accessToken = '';
  this._expiresAt = 0;
  this.unscheduleRenewal();
  // Go back to the home route
  this.router.navigate(['/']);
}
```

## Troubleshooting APIs

For more information on troubleshooting backend APIs and tokens, please see the [documentation for your technology stack](https://auth0.com/docs/quickstart/backend).

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
