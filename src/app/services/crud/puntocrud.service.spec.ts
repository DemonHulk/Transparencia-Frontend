import { TestBed } from '@angular/core/testing';

import { PuntocrudService } from './puntocrud.service';

describe('PuntocrudService', () => {
  let service: PuntocrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuntocrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
