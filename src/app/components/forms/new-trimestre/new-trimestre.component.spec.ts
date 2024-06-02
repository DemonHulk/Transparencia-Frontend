import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTrimestreComponent } from './new-trimestre.component';

describe('NewTrimestreComponent', () => {
  let component: NewTrimestreComponent;
  let fixture: ComponentFixture<NewTrimestreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewTrimestreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewTrimestreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
