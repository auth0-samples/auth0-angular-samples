import { Component, OnInit } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  API_URL = 'http://localhost:3001/api';
  message: string;

  constructor(public authHttp: AuthHttp) { }

  ngOnInit() {
  }

  public adminPing(): void {
    this.message = '';
    this.authHttp.post(`${this.API_URL}/admin`, {})
      .map(res => res.json())
      .subscribe(
        data => this.message = data.message,
        error => this.message = error
      );
  }
}
