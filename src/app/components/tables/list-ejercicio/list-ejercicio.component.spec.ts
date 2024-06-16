import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEjercicioComponent } from './list-ejercicio.component';

describe('ListEjercicioComponent', () => {
  let component: ListEjercicioComponent;
  let fixture: ComponentFixture<ListEjercicioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListEjercicioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListEjercicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
