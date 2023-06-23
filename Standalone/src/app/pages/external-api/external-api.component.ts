import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { AuthClientConfig } from '@auth0/auth0-angular';
import { HighlightModule } from 'ngx-highlightjs';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-external-api',
  templateUrl: './external-api.component.html',
  styleUrls: ['./external-api.component.css'],
  standalone: true,
  imports: [HighlightModule, NgClass, NgIf]
})
export class ExternalApiComponent {
  responseJson: string;
  audience: string | undefined;
  hasApiError = false;

  constructor(
    private api: ApiService,
    private configFactory: AuthClientConfig
  ) {
    this.audience = this.configFactory.get()?.authorizationParams.audience;
  }

  pingApi() {
    this.api.ping$().subscribe({
      next: (res) => {
        this.hasApiError = false;
        this.responseJson = JSON.stringify(res, null, 2).trim();
      },
      error: () => this.hasApiError = true,
    });
  }
}
