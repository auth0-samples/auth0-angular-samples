/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([])
      ],
      providers: [
        { provide: AuthService, useValue: { isAuthenticated: () => {}, handleAuthentication: () => {} } },
        { provide: APP_BASE_HREF, useValue: '/' }
      ],
      declarations: [
        AppComponent
      ],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    let fixture = TestBed.createComponent(AppComponent);
    let app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
