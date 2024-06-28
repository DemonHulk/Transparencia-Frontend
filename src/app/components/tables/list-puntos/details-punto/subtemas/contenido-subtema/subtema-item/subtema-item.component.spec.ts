import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubtemaItemComponent } from './subtema-item.component';

describe('SubtemaItemComponent', () => {
  let component: SubtemaItemComponent;
  let fixture: ComponentFixture<SubtemaItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SubtemaItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubtemaItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
