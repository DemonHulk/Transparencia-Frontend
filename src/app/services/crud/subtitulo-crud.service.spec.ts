import { TestBed } from '@angular/core/testing';

import { SubtituloCrudService } from './subtitulo-crud.service';

describe('SubtituloCrudService', () => {
  let service: SubtituloCrudService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubtituloCrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
