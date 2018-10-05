# Auth0 Angular Embedded Login

This sample demonstrates how to add authentication to an Angular application using Auth0's Lock widget embedded in your application.

Note that embedded login uses Cross Origin Authentication which [does not work well](https://auth0.com/docs/cross-origin-authentication#limitations-of-cross-origin-authentication) if you don't enable [Custom Domains](https://auth0.com/docs/custom-domains) which is a paid feature. 

The sample uses the Angular CLI.

## Getting Started

If you haven't already done so, [sign up](https://auth0.com) for your free Auth0 account and create a new client in the [dashboard](https://manage.auth0.com). Find the **domain** and **client ID** from the settings area and add the URL for your application to the **Allowed Callback URLs** box. If you are using the server provided by the Angular CLI, that URL is `http://localhost:4200`.

Make sure you have Angular CLI installed

```bash
npm install -g @angular/cli
```

Clone the repo, change directories into `auth0-angular-samples`, switch to the `embedded-login` branch, and change directories into `01-Embedded-Login`. Then install the dependencies.

```bash
git clone https://github.com/auth0-samples/auth0-angular-samples.git
cd auth0-angular-samples
git checkout embedded-login
cd 01-Embedded-Login
npm install
```

## Set the Client ID and Domain 

To configure the application for your Auth0 account settings, rename the `auth0-variables.ts.example` file to `auth0-variables.ts` and provide the **client ID** and **domain** there. This file is located in `src/app/auth/`.

## Using Cross Origin Authentication

When the user and password are entered in an embedded login form, a cross-origin call is made. Please read the [Cross Origin Authentication documentation](https://auth0.com/docs/cross-origin-authentication) in order to better understand how to configure it and its limitations.

Make sure you edit the contents of the `src/callback-cross-auth.html` file to match your Client Id, Domain and Callback settings. This page will only be used when third-party cookies are disabled in the client browser, and needs to be served over HTTPS. Note that when third-party cookies are disabled, there are some browsers where the authentication flow will NOT work unless you use [Custom Domains](https://auth0.com/docs/custom-domains).

## Run the Application

The development server that comes with the Angular CLI can be used to serve the application.

```bash
npm start
```

The application will be served at `http://localhost:3000`.

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, amont others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [Json Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

## Create a free Auth0 account

1. Go to [Auth0](https://auth0.com/signup) and click Sign Up.
2. Use Google, GitHub or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.

{"error":"unauthorized_client","error_description":"Grant type 'http://auth0.com/oauth/grant-type/password-realm' not allowed for the client.","error_uri":"https://auth0.com/docs/clients/client-grant-types"}
