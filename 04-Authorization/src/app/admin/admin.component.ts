import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {AuthService} from "../auth/auth.service";

interface IApiResponse {
  message: string;
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent implements OnInit {

  API_URL = 'http://localhost:3001/api';
  message: string;

  constructor(public auth: AuthService, private http: HttpClient) { }

  ngOnInit() {
  }

  public adminPing(): void {
    this.message = '';
    this.http
      .post<IApiResponse>(`${this.API_URL}/admin`, {}, {
        headers: new HttpHeaders()
          .set('Authorization', `Bearer ${this.auth.accessToken}`)
      })
      .subscribe(
        data => this.message = data.message,
        error => this.message = error
      );
  }
}
