import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ExternalApiComponent } from './external-api.component';
import { HighlightModule } from 'ngx-highlightjs';
import { hljsLanguages } from 'src/app/app.module';
import { HttpClientModule } from '@angular/common/http';

describe('ExternalApiComponent', () => {
  let component: ExternalApiComponent;
  let fixture: ComponentFixture<ExternalApiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExternalApiComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        HighlightModule.forRoot({
          languages: hljsLanguages
        })
      ]
    }).compileComponents();
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
