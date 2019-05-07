import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.getAuth0Client().then(client => {
      return client.isAuthenticated().then(isAuthenticated => {
        if (isAuthenticated) {
          return true;
        }

        client.loginWithRedirect({
          redirect_uri: `${window.location.origin}/callback`,
          appState: { target: next.url[0].path }
        });

        return false;
      });
    });
  }
}
