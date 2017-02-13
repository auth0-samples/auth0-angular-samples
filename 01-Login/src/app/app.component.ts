import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(public auth: AuthService) {
    console.log('hey there')
    // Comment out this method call if using
    // hash-based routing
    auth.handleAuthentication();
    
    // Uncomment this method call if using
    // hash-based routing
    // auth.handleAuthenticationWithHash();
  }

}
