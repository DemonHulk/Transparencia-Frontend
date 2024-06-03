import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSubtemaComponent } from './edit-subtema.component';

describe('EditSubtemaComponent', () => {
  let component: EditSubtemaComponent;
  let fixture: ComponentFixture<EditSubtemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditSubtemaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditSubtemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
