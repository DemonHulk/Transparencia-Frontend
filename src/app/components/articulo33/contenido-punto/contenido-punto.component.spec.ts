import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoPuntoComponent } from './contenido-punto.component';

describe('ContenidoPuntoComponent', () => {
  let component: ContenidoPuntoComponent;
  let fixture: ComponentFixture<ContenidoPuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContenidoPuntoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContenidoPuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
