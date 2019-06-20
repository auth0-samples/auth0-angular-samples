import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private authService: AuthService,
    private httpClient: HttpClient
  ) {}

  async ping(): Promise<any> {
    const client = await this.authService.getAuth0Client();
    const token = await client.getTokenSilently();

    return this.httpClient
      .get('/api/external', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .toPromise();
  }
}
