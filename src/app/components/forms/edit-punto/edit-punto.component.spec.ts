import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPuntoComponent } from './edit-punto.component';

describe('EditPuntoComponent', () => {
  let component: EditPuntoComponent;
  let fixture: ComponentFixture<EditPuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPuntoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
