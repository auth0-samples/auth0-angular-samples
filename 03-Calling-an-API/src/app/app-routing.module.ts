import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './containers/home/home.component';
import { CallbackComponent } from './containers/callback/callback.component';
import { ProfileComponent } from './containers/profile/profile.component';
import { LoginGuard } from './auth/login.guard';
import { ExternalApiComponent } from './containers/external-api/external-api.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'callback',
    component: CallbackComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'login',
    children: [],
    canActivate: [LoginGuard]
  },
  {
    path: 'external-api',
    component: ExternalApiComponent,
    canActivate: [LoginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
