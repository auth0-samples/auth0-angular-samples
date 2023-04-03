import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeContentComponent } from './home-content.component';

describe('HomeContentComponent', () => {
  let component: HomeContentComponent;
  let fixture: ComponentFixture<HomeContentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
