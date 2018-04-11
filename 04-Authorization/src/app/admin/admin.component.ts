import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  constructor(private http: HttpClient) { }

  ngOnInit() {
  }

  public adminPing(): void {
    this.message = '';
    this.http
      .post<IApiResponse>(`${this.API_URL}/admin`, {}, {
        headers: new HttpHeaders()
          .set('Authorization', `Bearer ${localStorage.getItem('access_token')}`)
      })
      .subscribe(
        data => this.message = data.message,
        error => this.message = error
      );
  }
}
