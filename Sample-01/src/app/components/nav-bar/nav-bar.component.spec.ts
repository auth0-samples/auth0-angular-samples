import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';

import { NavBarComponent } from './nav-bar.component';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['loginWithRedirect']);

    TestBed.configureTestingModule({
      declarations: [NavBarComponent],
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
      imports: [ NgbCollapseModule ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
