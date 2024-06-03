import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPuntosComponent } from './list-puntos.component';

describe('ListPuntosComponent', () => {
  let component: ListPuntosComponent;
  let fixture: ComponentFixture<ListPuntosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListPuntosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListPuntosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
