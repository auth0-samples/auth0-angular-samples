import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Auth0Error extends Error {
  error_description?: string;
  error?: string;
  error_uri?: string;
}

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  standalone: true,
  imports: [
    AsyncPipe
  ]
})
export class ErrorComponent implements OnInit {

  public error$: Observable<Auth0Error>;

  constructor(private auth: AuthService, private router: Router) {
    this.error$ = this.auth.error$ as Observable<Auth0Error>;
  }

  ngOnInit() {
    timer(0).pipe(takeUntil(this.error$)).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}

