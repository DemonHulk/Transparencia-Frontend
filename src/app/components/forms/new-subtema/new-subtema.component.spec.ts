import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubtemaComponent } from './new-subtema.component';

describe('NewSubtemaComponent', () => {
  let component: NewSubtemaComponent;
  let fixture: ComponentFixture<NewSubtemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewSubtemaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewSubtemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
