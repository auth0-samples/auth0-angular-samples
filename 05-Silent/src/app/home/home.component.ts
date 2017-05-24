import { Component } from '@angular/core';
import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(public auth: AuthService) { }

  get expiresAt() {
    return JSON.parse(window.localStorage.getItem('expires_at'));
  }

}
