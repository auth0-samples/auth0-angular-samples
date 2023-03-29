import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  Routes,
} from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ExternalApiComponent } from './pages/external-api/external-api.component';
import { ErrorComponent } from './pages/error/error.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { inject, Type } from '@angular/core';

// This function is only part of Angular 16.
// If you use Angular 15, you will need to provide this yourself.
// See: https://github.com/angular/angular/blob/main/packages/router/src/utils/functional_guards.ts#L35-L38
export function mapToCanActivate(
  providers: Array<Type<{ canActivate: CanActivateFn }>>
): CanActivateFn[] {
  return providers.map(
    (provider) => (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) =>
      inject(provider).canActivate(route, state)
  );
}

export const routes: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: mapToCanActivate([AuthGuard]),
  },
  {
    path: 'external-api',
    component: ExternalApiComponent,
    canActivate: mapToCanActivate([AuthGuard]),
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
];
