import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPuntoComponent } from './new-punto.component';

describe('NewPuntoComponent', () => {
  let component: NewPuntoComponent;
  let fixture: ComponentFixture<NewPuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPuntoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
