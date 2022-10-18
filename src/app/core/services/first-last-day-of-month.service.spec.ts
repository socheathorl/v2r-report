import { TestBed } from '@angular/core/testing';

import { FirstLastDayOfMonthService } from './first-last-day-of-month.service';

describe('FirstLastDayOfMonthService', () => {
  let service: FirstLastDayOfMonthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirstLastDayOfMonthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
