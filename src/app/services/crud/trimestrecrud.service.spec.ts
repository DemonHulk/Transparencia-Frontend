import { TestBed } from '@angular/core/testing';

import { TrimestrecrudService } from './trimestrecrud.service';

describe('TrimestrecrudService', () => {
  let service: TrimestrecrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrimestrecrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
