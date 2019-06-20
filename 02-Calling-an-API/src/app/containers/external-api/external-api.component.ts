import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-external-api',
  templateUrl: './external-api.component.html',
  styleUrls: ['./external-api.component.css']
})
export class ExternalApiComponent {
  responseJson: string;
  hasResponse = false;

  constructor(private apiService: ApiService) {}

  async pingApi() {
    const response = await this.apiService.ping();

    this.responseJson = JSON.stringify(response, null, 2).trim();
    this.hasResponse = true;
  }
}
