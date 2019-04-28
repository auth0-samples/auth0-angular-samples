import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  async ngOnInit() {
    const client = await this.authService.getAuth0Client();

    await client.loginWithRedirect({
      redirect_uri: `${window.location.origin}/callback`
    });
  }
}
