import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <main>
      hello world!
      <router-outlet />
    </main>
  `,
})
export class App {
  protected readonly title = signal('auth0-angular');
}
