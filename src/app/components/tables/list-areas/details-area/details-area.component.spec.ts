import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsAreaComponent } from './details-area.component';

describe('DetailsAreaComponent', () => {
  let component: DetailsAreaComponent;
  let fixture: ComponentFixture<DetailsAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsAreaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetailsAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
