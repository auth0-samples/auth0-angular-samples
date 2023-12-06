import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf
  ]
})
export class ErrorComponent implements OnInit {

  public error$: Observable<Error>;

  constructor(private auth: AuthService, private router: Router) {
    this.error$ = this.auth.error$;
  }

  ngOnInit() {
    timer(0).pipe(takeUntil(this.error$)).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}

