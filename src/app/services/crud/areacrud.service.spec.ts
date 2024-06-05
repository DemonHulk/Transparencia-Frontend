import { TestBed } from '@angular/core/testing';

import { AreacrudService } from './areacrud.service';

describe('AreacrudService', () => {
  let service: AreacrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreacrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
