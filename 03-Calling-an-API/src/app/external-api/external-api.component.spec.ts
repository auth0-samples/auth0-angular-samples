import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalApiComponent } from './external-api.component';

describe('ExternalApiComponent', () => {
  let component: ExternalApiComponent;
  let fixture: ComponentFixture<ExternalApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalApiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalApiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
