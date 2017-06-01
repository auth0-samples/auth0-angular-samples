import { Routes, CanActivate } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PingComponent } from './ping/ping.component';
import { AdminComponent } from './admin/admin.component';
import { ProfileComponent } from './profile/profile.component';
import { CallbackComponent } from './callback/callback.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { ScopeGuardService as ScopeGuard } from './auth/scope-guard.service';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'ping', component: PingComponent, canActivate: [AuthGuard] },
  { path: 'admin', component: AdminComponent, canActivate: [ScopeGuard], data: { expectedScopes: ['write:messages']} },
  { path: 'callback', component: CallbackComponent },
  { path: '**', redirectTo: '' }
];
