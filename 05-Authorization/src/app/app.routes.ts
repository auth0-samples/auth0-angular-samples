import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PingComponent } from './ping/ping.component';
import { AdminComponent } from './admin/admin.component';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent },
  { path: 'ping', component: PingComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
