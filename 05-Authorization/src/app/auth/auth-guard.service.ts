import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthService, public router: Router) {}

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      if (this.auth.isAdmin()) {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    }
  }

}
