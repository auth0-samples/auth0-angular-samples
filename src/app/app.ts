import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/* highlight-start import-auth0 */
import { inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';
/* highlight-end import-auth0 */

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    /* highlight-start imports-common */
    CommonModule,
    /* highlight-end imports-common */
  ],
  templateUrl: './app.html',
})
export class App {
  /* highlight-start auth0-inject */
  protected readonly window = window;
  protected auth = inject(AuthService);
  /* highlight-end auth0-inject */
}
