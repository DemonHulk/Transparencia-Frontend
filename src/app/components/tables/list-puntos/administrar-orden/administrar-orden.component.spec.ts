import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrarOrdenComponent } from './administrar-orden.component';

describe('AdministrarOrdenComponent', () => {
  let component: AdministrarOrdenComponent;
  let fixture: ComponentFixture<AdministrarOrdenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdministrarOrdenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdministrarOrdenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
