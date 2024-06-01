import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Articulo33Component } from './articulo33.component';

describe('Articulo33Component', () => {
  let component: Articulo33Component;
  let fixture: ComponentFixture<Articulo33Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Articulo33Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Articulo33Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
