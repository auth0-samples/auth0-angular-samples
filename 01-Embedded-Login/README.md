# Auth0 Angular Embedded Login

This sample demonstrates how to add authentication to an Angular application using Auth0's Lock widget embedded in your application. The sample uses the Angular CLI.

## Getting Started

If you haven't already done so, [sign up](https://auth0.com) for your free Auth0 account and create a new client in the [dashboard](https://manage.auth0.com). Find the **domain** and **client ID** from the settings area and add the URL for your application to the **Allowed Callback URLs** box. If you are using the server provided by the Angular CLI, that URL is `http://localhost:4200`.

Make sure you have Angular CLI installed

```bash
npm install -g @angular/cli
```

Clone the repo or download it from the Angular quickstart page in Auth0's documentation. Change directories into `auth0-angular-samples`, switch to the `embedded-login` branch, and change directories into `01-Embedded-Login`. Then install the dependencies.

```bash
git clone https://github.com/auth0-samples/auth0-angular-samples.git
cd auth0-angular-samples
git checkout embedded-login
cd 01-Embedded-Login
npm install
```

## Set the Client ID and Domain

If you download the sample from the quickstart page, it will come pre-populated with the **client ID** and **domain** for your application. If you clone the repo directly from Github, rename the `auth0-variables.ts.example` file to `auth0-variables.ts` and provide the **client ID** and **domain** there. This file is located in `src/app/auth/`.

## Enable the Password Grant

In order to be able to log-in with user and password you need to enable the [Password grant](https://auth0.com/docs/clients/client-grant-types). Set it in your Client settings in the [Auth0 Dashboard](https://manage.auth0.com). 

Click 'Show Advanced Settings', click the 'Grant Types' tab, and check the 'Password' checkbox.

![password grant](../../blob/embedded-login/01-Embedded-Login/password-grant.png/password-grant.png)

## Run the Application

The development server that comes with the Angular CLI can be used to serve the application.

```bash
npm start
```

The application will be served at `http://localhost:4200`.

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