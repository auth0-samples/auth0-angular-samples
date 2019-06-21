# Auth0 Angular User Profile

This sample demonstrates how to get a user's profile using Auth0 in an Angular application. It uses the Angular CLI.

## Getting Started

If you haven't already done so, [sign up](https://auth0.com) for your free Auth0 account and create a new client in the [dashboard](https://manage.auth0.com). Find the **domain** and **client ID** from the settings area and add the URL for your application to the **Allowed Callback URLs** box.

Clone the repo or download it from the Angular quickstart page in Auth0's documentation. Install the Angular CLI and the dependencies for the app.

```bash
npm install -g @angular/cli
cd 02-User-Profile
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

Most applications display profile information to authenticated users. Auth0 provides a `/userinfo` endpoint for that. When you send an Access Token to the endpoint, it returns a JSON object with information about the user. The information stored in that object depends on how the user logged in to your application.

To learn more about the information returned by the `/userinfo` endpoint, see the [/userinfo endpoint documentation](https://auth0.com/docs/api/authentication#get-user-info).

## Request the Profile Scope

To retrieve user information, request a scope of `openid profile` in the instance of the `auth0.WebAuth` object.

```ts
// src/app/auth/auth.service.ts

auth0 = new auth0.WebAuth({
  // ...
  scope: "openid profile"
});
```

## Retrieve User Information

Use the `client.userInfo` method from the auth0.js library to get user information from the `/userinfo` endpoint.

Use the following arguments in the `client.userInfo` method:

1. The user's Access Token
2. A callback function with arguments for a potential error and a profile

Add a method that calls the `client.userInfo` method to the `AuthService` service.

```ts
// src/app/auth/auth.service.ts

// ...
userProfile: any;

//...
public getProfile(cb): void {
  if (!this._accessToken) {
    throw new Error('Access Token must exist to fetch profile');
  }

  const self = this;
  this.auth0.client.userInfo(this._accessToken, (err, profile) => {
    if (profile) {
      self.userProfile = profile;
    }
    cb(err, profile);
  });
}
```

The service includes a local `userProfile` member that caches the profile information you requested with the `getProfile` call.

## Display the User Profile

Some applications have a dedicated profile section for displaying user information. The example below shows how to set it up.

Create a new component called `ProfileComponent`.

```ts
// src/app/profile/profile.component.ts

import { Component, OnInit } from "@angular/core";
import { AuthService } from "./../auth/auth.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  profile: any;

  constructor(public auth: AuthService) {}

  ngOnInit() {
    if (this.auth.userProfile) {
      this.profile = this.auth.userProfile;
    } else {
      this.auth.getProfile((err, profile) => {
        this.profile = profile;
      });
    }
  }
}
```

The component injects the `AuthService` service. Then, it checks the service for a populated `userProfile` object. If it doesn't find the object, the component makes a call to `getProfile` to get the user's information.

The user's information can be displayed in a template.

```html
<!-- src/app/profile/profile.component.html -->

<div class="panel panel-default profile-area">
  <div class="panel-heading">
    <h3>Profile</h3>
  </div>
  <div class="panel-body">
    <img src="{{profile?.picture}}" class="avatar" alt="avatar" />
    <div>
      <label><i class="glyphicon glyphicon-user"></i> Nickname</label>
      <h3 class="nickname">{{ profile?.nickname }}</h3>
    </div>
    <pre class="full-profile">{{ profile | json }}</pre>
  </div>
</div>
```

## Allow Users to Update Their Profile

You can allow your users to update their profile information. Auth0 provides a `user_metadata` object to store information that users can edit. See [Metadata](https://auth0.com/docs/users/concepts/overview-user-metadata) for more information.

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
