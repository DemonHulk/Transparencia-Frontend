import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidoPuntoSkeletonComponent } from './contenido-punto-skeleton.component';

describe('ContenidoPuntoSkeletonComponent', () => {
  let component: ContenidoPuntoSkeletonComponent;
  let fixture: ComponentFixture<ContenidoPuntoSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContenidoPuntoSkeletonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContenidoPuntoSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
