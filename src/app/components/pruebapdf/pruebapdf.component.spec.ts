import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PruebapdfComponent } from './pruebapdf.component';

describe('PruebapdfComponent', () => {
  let component: PruebapdfComponent;
  let fixture: ComponentFixture<PruebapdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PruebapdfComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PruebapdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
