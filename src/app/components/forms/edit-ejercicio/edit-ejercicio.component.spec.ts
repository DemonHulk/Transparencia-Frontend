import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditEjercicioComponent } from './edit-ejercicio.component';

describe('EditEjercicioComponent', () => {
  let component: EditEjercicioComponent;
  let fixture: ComponentFixture<EditEjercicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditEjercicioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditEjercicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
