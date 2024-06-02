import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTrimestreComponent } from './edit-trimestre.component';

describe('EditTrimestreComponent', () => {
  let component: EditTrimestreComponent;
  let fixture: ComponentFixture<EditTrimestreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditTrimestreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditTrimestreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
