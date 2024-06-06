import { TestBed } from '@angular/core/testing';

import { UsuariocrudService } from './usuariocrud.service';

describe('UsuariocrudService', () => {
  let service: UsuariocrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuariocrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
