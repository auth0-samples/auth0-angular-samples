# Auth0 Angular Samples

[![CircleCI](https://circleci.com/gh/auth0-samples/auth0-angular-samples.svg?style=svg)](https://circleci.com/gh/auth0-samples/auth0-angular-samples)

These samples demonstrate how to add authentication to an Angular application with Auth0, using [auth0-angular](https://github.com/auth0/auth0-angular). Each folder contains a distinct application so that various Auth0 features can be viewed in isolation. You can read about these examples in our [Angular Quickstart](https://auth0.com/docs/quickstart/spa/angular).

Read the [full tutorials on Auth0.com](https://auth0.com/docs/quickstart/spa/angular).

## Embedded Integration Samples

These samples use Auth0's [universal login page](https://auth0.com/docs/hosted-pages/login) which offers the fastest, most secure, and most feature-rich way to add authentication to your app.

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

### Auth0 Configuration for the Sample Application(s)
The example application(s) require to be configured with your Auth0 information in order to run succesfully.
This can be done by renaming `auth_config.json.example` (https://github.com/auth0-samples/auth0-angular-samples/blob/main/Sample-01/auth_config.json.example) to `auth_config.json` and replacing `{DOMAIN}`, `{CLIENT_ID}` and `{API_IDENTIFIER}` with your tenant specific values:

```
{
  "domain": "YOUR_DOMAIN",
  "clientId": "YOUR_CLIENT_ID",
  "authorizationParams": {
    "audience": "{yourApiIdentifier}",
  },
  "apiUri": "http://localhost:3001",
  "appUri": "http://localhost:4200"
}
```

> **Domain** and **Client Id** can be found in the corresponding Application in the Auth0 Dashboard, while **Audience** needs to be set to the identifier of the API, found in the Auth0 Dashboard.

Also ensure the Application in Auth0 is configured to allow **http://localhost:4200** as a `Callback URL`, `Logout URL` and `Allowed Web Origin`.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/whitehat) details the procedure for disclosing security issues.

## Author

[Auth0](https://auth0.com)

## Deploy to Netlify
You can deploy this example as a site on your own to explore and experiment with, by clicking this button.
After deploy, install Auth0 by Okta extension in Netlify and follow the steps to create an App.

<a href="https://app.netlify.com/start/deploy?repository=https://github.com/auth0-samples/auth0-angular-samples"><img src="https://www.netlify.com/img/deploy/button.svg" alt="Deploy to Netlify" height=30px></a>

## License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for more info.
