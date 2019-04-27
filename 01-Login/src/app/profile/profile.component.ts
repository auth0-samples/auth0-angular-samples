import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any;
  profileJson: string;

  constructor(private authService: AuthService) {}

  async ngOnInit() {
    const client = await this.authService.getAuth0Client();
    this.profile = await client.getUser();
    this.profileJson = JSON.stringify(this.profile, null, 2);
  }
}
