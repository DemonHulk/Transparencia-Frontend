import { TestBed } from '@angular/core/testing';

import { PuntosareascrudService } from './puntosareascrud.service';

describe('PuntosareascrudService', () => {
  let service: PuntosareascrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuntosareascrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
