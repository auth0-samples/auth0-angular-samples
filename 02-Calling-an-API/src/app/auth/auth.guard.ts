import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    const client = await this.authService.getAuth0Client();
    const isAuthenticated = await client.isAuthenticated();

    if (isAuthenticated) {
      return true;
    }

    client.loginWithRedirect({
      redirect_uri: `${window.location.origin}/callback`,
      appState: { target: state.url }
    });

    return false;
  }
}
