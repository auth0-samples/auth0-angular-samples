import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

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
    this.authService.profile.subscribe(profile => {
      if (profile) {
        this.profile = profile;
        this.profileJson = JSON.stringify(this.profile, null, 2);
        return;
      }

      this.profile = null;
      this.profileJson = null;
    });
  }
}
