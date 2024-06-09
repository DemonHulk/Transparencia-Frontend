import { TestBed } from '@angular/core/testing';

import { AlertsServiceService } from './alerts-service.service';

describe('AlertsServiceService', () => {
  let service: AlertsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
