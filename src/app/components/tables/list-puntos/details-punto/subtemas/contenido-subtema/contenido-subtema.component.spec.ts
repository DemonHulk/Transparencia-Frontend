import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoSubtemaComponent } from './contenido-subtema.component';

describe('ContenidoSubtemaComponent', () => {
  let component: ContenidoSubtemaComponent;
  let fixture: ComponentFixture<ContenidoSubtemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContenidoSubtemaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContenidoSubtemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
