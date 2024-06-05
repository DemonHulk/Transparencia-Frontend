import { TestBed } from '@angular/core/testing';

import { AreaCrudService } from './area.service';

describe('AreaCrudService', () => {
  let service: AreaCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AreaCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
