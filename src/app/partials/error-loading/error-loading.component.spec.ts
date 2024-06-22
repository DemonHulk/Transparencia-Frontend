import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorLoadingComponent } from './error-loading.component';

describe('ErrorLoadingComponent', () => {
  let component: ErrorLoadingComponent;
  let fixture: ComponentFixture<ErrorLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ErrorLoadingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
