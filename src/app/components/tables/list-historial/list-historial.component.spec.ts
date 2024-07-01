import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListHistorialComponent } from './list-historial.component';

describe('ListHistorialComponent', () => {
  let component: ListHistorialComponent;
  let fixture: ComponentFixture<ListHistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListHistorialComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListHistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
