import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTrimestresComponent } from './list-trimestres.component';

describe('ListTrimestresComponent', () => {
  let component: ListTrimestresComponent;
  let fixture: ComponentFixture<ListTrimestresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListTrimestresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListTrimestresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
