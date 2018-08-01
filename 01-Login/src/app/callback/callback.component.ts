import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from './../auth/auth.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {

  constructor(public auth: AuthService, public router:Router) { 
    if (auth.isAuthenticated()) {
      this.router.navigate(['/']);
    }

  }

  ngOnInit() {
  }

}
