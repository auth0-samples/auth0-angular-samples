import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
})
export class ErrorComponent implements OnInit {

  public error$ = this.auth.error$;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    timer(0).pipe(takeUntil(this.error$)).subscribe(() => {
      this.router.navigateByUrl('/');
    });
  }
}

