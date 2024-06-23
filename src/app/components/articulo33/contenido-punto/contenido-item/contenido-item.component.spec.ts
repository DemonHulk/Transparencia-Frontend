import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoItemComponent } from './contenido-item.component';

describe('ContenidoItemComponent', () => {
  let component: ContenidoItemComponent;
  let fixture: ComponentFixture<ContenidoItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContenidoItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContenidoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
