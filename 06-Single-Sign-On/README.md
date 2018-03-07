# Auth0 Angular Single Sign-On

This sample contains two distinct Angular applications, **sso-app-one** and **sso-app-two**. The purpose of the sample is to demonstrate how to implement single sign-on in multiple applications. When a user authenticates in one of the applications, they will automatically be authenticated in the other when it loads. The sample uses the Angular CLI.

Running this sample will result in both of the applications being served simultaneously. The first application will be served at `http://localhost:3000` and the second at `http://localhost:3001`.

## Getting Started

Create a new API in the [APIs section](https://manage.auth0.com/#/apis) and provide an identifier for it.

Clone the repo or download it from the Angular quickstart page in Auth0's documentation. Install the Angular CLI and the dependencies for the app.

```bash
npm install -g @angular/cli
cd 06-Single-Sign-On
npm install
```

## Set the Client ID, Domain, and API URL

If you download the sample from the quickstart page, it will come pre-populated with the **Client ID** and **Domain** for your application. If you clone the repo directly from Github, rename the `auth0-variables.ts.example` files in each of the sample applications to `auth0-variables.ts` and provide the **Client ID** and **Domain** there. This file is located in `src/app/auth/`.

## Run the Application

The development server that comes with the Angular CLI can be used to serve the application.

```bash
npm start
```

The first application will be served at `http://localhost:3000` and the second at `http://localhost:3001`.

> **Note:** The default Angular CLI port is `4200`, but Auth0 samples use custom ports instead.

## Run the Application With Docker

In order to run the example with docker you need to have `docker` installed.

You also need to set the environment variables as explained [previously](#set-the-client-id-domain-and-api-url).

Execute in command line `sh exec.sh` to run the Docker in Linux, or `.\exec.ps1` to run the Docker in Windows.

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

[Auth0](https://auth0.com)

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE.txt) file for more info.

