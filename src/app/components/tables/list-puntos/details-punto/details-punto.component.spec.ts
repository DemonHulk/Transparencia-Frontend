import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsPuntoComponent } from './details-punto.component';

describe('DetailsPuntoComponent', () => {
  let component: DetailsPuntoComponent;
  let fixture: ComponentFixture<DetailsPuntoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsPuntoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsPuntoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
