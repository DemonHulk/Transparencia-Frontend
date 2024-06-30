import { TestBed } from '@angular/core/testing';

import { HistorialcrudService } from './historialcrud.service';

describe('HistorialcrudService', () => {
  let service: HistorialcrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistorialcrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
