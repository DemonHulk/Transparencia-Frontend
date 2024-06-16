import { TestBed } from '@angular/core/testing';

import { EjerciciocrudService } from './ejerciciocrud.service';

describe('EjerciciocrudService', () => {
  let service: EjerciciocrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EjerciciocrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
