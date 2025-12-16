import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/* highlight-start import-auth0 */
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
/* highlight-end import-auth0 */

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
})
export class App {
  /* highlight-start auth0-inject */
  protected auth = inject(AuthService);
  /* highlight-end auth0-inject */
}
