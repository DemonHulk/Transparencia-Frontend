import { TestBed } from '@angular/core/testing';

import { ContenidocrudService } from './contenidocrud.service';

describe('ContenidocrudService', () => {
  let service: ContenidocrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContenidocrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
