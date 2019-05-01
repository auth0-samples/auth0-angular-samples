# Angular Quickstart - Login

This sample app demonstrates how to log in, log out, and view profile information of the logged-in user. It uses [auth0-spa-js](https://github.com/auth0/auth0-spa-js).

**Note**: This sample should be considered EARLY ACCESS and as such is subject to change.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.8.

## Configuration

The sample needs to be configured with your Auth0 domain and client ID in order to work. In the root of the sample, copy `auth_config.json.example` and rename it to `auth_config.json`. Open the file and replace the values with those from your Auth0 tenant:

```json
{
  "domain": "<YOUR AUTH0 DOMAIN>",
  "clientId": "<YOUR AUTH0 CLIENT ID>"
}
```

## Development server

Run `npm start` for a dev server. Navigate to `http://localhost:3000/`. The app will automatically reload if you change any of the source files.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Tutorial: Logging in and Gated Content

This tutorial will guide you in creating a basic Angular application using the [Angular CLI](https://cli.angular.io/), that demonstrates how users can log in, log out, and how to view their profile information. It will also show you how to protect routes from unauthenticated users.

## Prerequisites

You should have a [recent version of Node](https://nodejs.org/en/download/) installed in order to follow along with this tutorial.

## Setting up the Application

Find a directory on your computer to create a new application. In the terminal, install the Angular CLI:

```bash
npm install -g @angular/cli
```

Then create a new application:

```bash
ng new login-demo
```

When asked "Would you like to use Angular routing?", select **yes**.

When asked "Which stylesheet format would you like to use?", select **CSS**.

Once the creation of the application finishes, move into the application directory:

```bash
cd login-demo
```

Next, install the Auth0 JS SDK; you will make use of this later to authenticate users with your app:

```bash
npm i @auth0/auth0-spa-js
```

At this point, you can open the folder in your favorite code editor, as you will be starting to edit files from this point on.

## The Auth0 Dashboard

If you do not already have an Auth0 account, you can [create a free account here](https://auth0.com/signup).

### Configuring Auth0

Access the [Auth0 dashboard](https://manage.auth0.com/#/applications) and go into the Applications section.

![Creating a new Auth0 application](https://cdn.auth0.com/blog/quickstarts:create-app.png)

1.  Create a new Application of type "Single Page Application" by giving it a name of choice and clicking "Create". The dashboard redirects you to the quickstart which you can skip and go straight to the "Settings" tab.
2.  At the top of the page are displayed the `client_id` and `domain` values. Take note of them as you will be using them later.
3.  Add `http://localhost:3000/callback` into the "Allowed Callback URLs" box.
4.  Add `http://localhost:3000` into the "Allowed Web Origins" box.
5.  Lastly, add `http://localhost:3000` into the "Allowed Logout URLs" box.
6.  Click the `SAVE CHANGES` button to save the configuration.
7.  Go to the "Connections" tab and enable the connections you wish to use for authentication. e.g. the default "Username-Password-Authentication".

![Retrieving your Auth0 credentials](https://cdn.auth0.com/blog/quickstarts:create-app2.png)

### Configuring the app

In the root of your Angular application, create a new file called `auth_config.json`. Open the file and populate it with the following content, replacing the values with those from your Auth0 tenant:

```json
{
  "domain": "{YOUR AUTH0 DOMAIN}",
  "clientId": "{YOUR AUTH0 CLIENT ID}"
}
```

In order for TypeScript to be able to import this JSON file, make a small tweak to the `tsconfig.json` file by adding the `resolveJsonModule` flag. The resulting file should look something like the following:

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "sourceMap": true,
    "declaration": false,
    "module": "es2015",
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es5",
    "typeRoots": ["node_modules/@types"],
    "lib": ["es2018", "dom"],
    "resolveJsonModule": true
  }
}
```

Notice that the `resolveJsonModule` key has been added to the `compilerOptions` node, with a value of `true`.

> **Note**: A JSON file is being used here instead of a TypeScript file, as it will be shared in the next part of the tutorial by the backend server.

Finally, configure the application to start on port 3000. Open `package.json` and modify the start script to look like the following:

```json
{
  "scripts": {
    "ng": "ng",
    "start": "ng serve --port 3000",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint",
    "e2e": "ng e2e"
  }
}
```

Notice that the `start` script has had `--port 3000` appended to it. This aligns it with the Auth0 configuration specified above.

> **Checkpoint**: run the app using `npm start` and make sure that the Angular start page can be reached by visiting [http://localhost:3000](http://localhost:3000).

## Building out the Application

In the sections that follow, you will be adding components and services, and building a simple UI to allow the user to log in, log out, and view their profile information.

### Adding an authentication service

To manage the authentication state, create a new service that can be injected into your components by using the Angular CLI:

```bash
ng generate service auth/AuthService
```

A new file `src/app/auth/auth.service.ts` will be generated for you. Open this inside your code editor and add the following content:

```js
import { Injectable } from '@angular/core';
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

  private auth0Client: Auth0Client;

  /**
   * Gets the Auth0Client instance.
   */
  async getAuth0Client(): Promise<Auth0Client> {
    if (!this.auth0Client) {
      this.auth0Client = await createAuth0Client({
        domain: config.domain,
        client_id: config.clientId
      });

      try {
        // Make sure the session has been initialized
        await this.auth0Client.getTokenSilently();

        // Provide the current value of isAuthenticated
        this.isAuthenticated.next(await this.auth0Client.isAuthenticated());

        // Whenever isAuthenticated changes, provide the current value of `getUser`
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

This service provides a single method `getAuth0Client`. When called, it will in turn call `createAuth0Client` from the Auth0 JS SDK and save it in a class-level variable. Subsequent calls to `getAuth0Client` will return the same instance.

The service uses [RxJS](https://www.learnrxjs.io/) to emit changes in values to the `isAuthenticated` state and the user's profile. These will be used in a moment to listen for changes and update the UI accordingly.

### Adding a navigation bar component

Add a component that will house the login and logout buttons by using the Angular CLI in the terminal:

```bash
ng generate component navbar
```

Open the `src/app/navbar/navbar.component.ts` file and replace its contents with the following:

```js
import { Component, OnInit } from '@angular/core';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/src/Auth0Client';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isAuthenticated = false;
  profile: any;

  private auth0Client: Auth0Client;

  /**
   * Constructor - inject the AuthService class
   */
  constructor(private authService: AuthService) {}

  /**
   * Handle component initialization
   */
  async ngOnInit() {
    // Get an instance of the Auth0 client
    this.auth0Client = await this.authService.getAuth0Client();

    // Watch for changes to the isAuthenticated state
    this.authService.isAuthenticated.subscribe(value => {
      this.isAuthenticated = value;
    });

    // Watch for changes to the profile data
    this.authService.profile.subscribe(profile => {
      this.profile = profile;
    });
  }

  /**
   * Logs in the user by redirecting to Auth0 for authentication
   */
  async login() {
    await this.auth0Client.loginWithRedirect({
      redirect_uri: `${window.location.origin}/callback`
    });
  }

  /**
   * Logs the user out of the applicaion, as well as on Auth0
   */
  logout() {
    this.auth0Client.logout();
  }
}
```

Notice that the AuthService class you created in the previous section is being injected into the component through the constructor. This allows you to get an instance of the client, as well as react to changes in authentication state.

The main setup work is being carried out inside `ngOnInit`, where the RxJS `BehaviorSubject` instances are being used. Whenever the values of these change, the Navbar component will react to those changes and provide an updated UI.

Functions are provided to log in and log out the user using `loginWithRedirect` and `logout` directly on the Auth0 client. In the log in case, a URI is provided, indicating where Auth0 should redirect to once authentication is complete.

> **Note**: This URL was registered with Auth0 as an Allowed Callback URL at the beginning of the tutorial

Configure the UI for the `navbar` component by opening the `src/app/navbar/navbar.component.html` file and replacing its contents with the following:

```html
<header>
  <button (click)="login()" *ngIf="!isAuthenticated">Log In</button>
  <button (click)="logout()" *ngIf="isAuthenticated">Log Out</button>
</header>
```

Angular bindings are used here to show each button at the right time; the Login button when the user is unauthenticated, and the Log Out button when the user has been authenticated. Their `click` events are wired up to call the `login` and `logout` functions on the component respectively.

Finally, to show this component on the screen, open the `src/app/app.component.html` file and replace the default UI with the following:

```html
<app-navbar></app-navbar>

<router-outlet></router-outlet>
```

> **Checkpoint**: Run the application now using `npm start`. The login button should be visible, and you should be able to click it to be redirected to Auth0 for login.

### Creating the callback component

To complete the authentication story, the callback route must be handled.

Use the Angular CLI to create a new component called `Callback`:

```bash
ng generate component Callback
```

Open the newly-generated `src/app/callback/callback.component.ts` file and replace its contents with the following:

```js
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    const client = await this.authService.getAuth0Client();

    // Handle the redirect from Auth0
    await client.handleRedirectCallback();

    this.router.navigate(['']);
  }
}
```

The key line is `await client.handleRedirectCallback`, which takes the processes the data in the callback from Auth0 and retrieves the tokens. It also sets some internal state that can be used to determine whether the user is authenticated or not.

In order for this component to work, the Angular router must be adjusted so that this component is used when the `/callback` route is hit. Open `src/app/app-routing.module.ts` and replace its content with the following:

```js
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';

const routes: Routes = [
  {
    path: 'callback',
    component: CallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

The primary change here is to add in the `callback` route which points to the `CallbackComponent`.

> **Checkpoint**: Run the app again. This time you should be able to log in and have the application handle the callback appropriately, sending you back to the default route. The "log out" button should now be visible. Check that the "log out" button works and that the user is unauthenticated when clicked.

### Showing profile information

Create a new component called "Profile" using the Angular CLI:

```bash
ng generate component Profile
```

Open `src/app/profile/profile.component.ts` and replace its contents with the following:

```js
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.profile.subscribe(profile => (this.profile = profile));
  }
}
```

In order to retrieve the profile data, the component subscribes to changes on the `profile` property of `AuthService` and sets a class-level property to its value. This property can be used to drive the UI and show the profile information on the screen.

To do this, open `src/app/profile/profile.component.html` and replace its contents with the following:

```html
<pre *ngIf="profile">
  <code>{{profile | json}}</code>
</pre>
```

This simple UI displays a JSON representation of the profile object, only if the `profile` property on the component has a value. This means that the UI will be present if the user is logged in, and invisible if they are not.

To view the profile page, the router must be updated to show the profile component at the right time. Open `src/app/app-routing.module.ts` and adjust the `routes` map to look like the following:

```js
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';

// NEW - import the Profile component
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: 'callback',
    component: CallbackComponent
  },

  // NEW - add a route to the profile component
  {
    path: 'profile',
    component: ProfileComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

Finally, update the navigation bar to include some router links so that we can navigate between the different pages. Open `src/app/navbar/navbar.component.html` and update it to look like the following:

```html
<header>
  <button (click)="login()" *ngIf="!isAuthenticated">Log in</button>
  <button (click)="logout()" *ngIf="isAuthenticated">Log out</button>

  <!-- NEW - add a couple of router links to the home page, and to profile -->
  <a [routerLink]="['']">Home</a>&nbsp;
  <a [routerLink]="['profile']" *ngIf="isAuthenticated">Profile</a>
</header>
```

Run the application and log in. You should now find that, once you have logged in, you should be able to browse to the profile page. Your profile information should be present on the screen in JSON format. Try logging out of the application again to make sure that the profile information disappears as you would expect.

## Gated Content

Right now, your users could simply enter the `/profile` path into their URL bar and reach the profile page, even if they're unauthenticated. You're going to use a [Guard](https://angular.io/guide/router#milestone-5-route-guards) to help prevent that from happening.

### Adding a guard

The Angular CLI can be used to generate a guard:

```bash
ng generate guard auth/auth
```

When asked the question "Which interfaces would you like to implement?", select "CanActivate".

Open the `src/app/auth/auth.guard.ts` file and replace its contents with the following:

```js
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
   | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.authService.getAuth0Client().then(client => {
      return client.isAuthenticated().then(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        }

        client.loginWithRedirect({
          redirect_uri: `${window.location.origin}/callback`,
          appState: { target: next.url[0].path }
        });
      });
    });
  }
}
```

The key part here is the implementation of the `canActivate` method. First, the Auth0 client is retrieved. Then, the `isAuthenticated` value is interrogated. If the user is already authenticated, then `true` is returned to indicate that the current route can continue.

If the user is not authenticated, then the `loginWithRedirect` method is invoked, causing the user to be logged in. Also notice that the `appState` property in the options for `loginWithRedirect` is set to an object containing a `target` property. This value is set to the route that the user was trying to access when this guard was activated. We can use this to helpfully redirect the user to where they were trying to reach once they have successfully authenticated with Auth0.

In order for this guard to work, it must be applied to the router so that the `/profile` route cannot be accessed unless the user is logged in. Open the `src/app/app-routing.module.ts` file and update it so that the guard is used. It should look something like the following:

```js
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CallbackComponent } from './callback/callback.component';
import { ProfileComponent } from './profile/profile.component';

// NEW - import the guard
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard] // NEW - apply the guard to the `profile` route
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

Finally, to make use of the helpful redirect once the user has returned from the authorization server, update the callback component to read the `appState` value and redirect the user to the right place. It should now look something like the following:

```js
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  async ngOnInit() {
    const client = await this.authService.getAuth0Client();
    const result = await client.handleRedirectCallback();

    // NEW - retrieve the URL that the user was trying to reach..
    const targetRoute = result.appState.target ? result.appState.target : '';

    // .. and navigate the user to that location
    this.router.navigate([targetRoute]);
  }
}
```

Check that the application works as intended, by logging out of the application, then trying to access `http://localhost:3000/profile` route directly in the URL bar. You should be automatically redirected to the Auth0 Login page before being able to access your profile information in the app. Note that the application should automatically route you to the `/profile` page after authentication, thanks to the updates made to the callback component.
