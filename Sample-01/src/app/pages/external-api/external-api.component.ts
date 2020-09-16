import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-external-api',
  templateUrl: './external-api.component.html',
  styleUrls: ['./external-api.component.css'],
})
export class ExternalApiComponent {
  responseJson: string;

  constructor(private api: ApiService) {}

  pingApi() {
    this.api
      .ping$()
      .subscribe(
        (res) => (this.responseJson = JSON.stringify(res, null, 2).trim())
      );
  }
}
