import { TestBed } from '@angular/core/testing';

import { TituloscrudService } from './tituloscrud.service';

describe('TituloscrudService', () => {
  let service: TituloscrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TituloscrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
