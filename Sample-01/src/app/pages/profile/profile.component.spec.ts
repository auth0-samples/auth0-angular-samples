import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '@auth0/auth0-angular';
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';

import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let auth0ClientSpy: any;

  beforeEach(() => {
    auth0ClientSpy = jasmine.createSpyObj('Auth0Client', ['loginWithRedirect']);

    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [],
      providers: [
        {
          provide: HIGHLIGHT_OPTIONS,
          useValue: {
            coreLibraryLoader: () => import('highlight.js/lib/highlight'),
            languages: {
              json: () => import('highlight.js/lib/languages/json'),
            },
          },
        },
        { provide: AuthService, useValue: auth0ClientSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
