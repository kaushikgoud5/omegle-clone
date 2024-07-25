import { TestBed } from '@angular/core/testing';

import { GetCamService } from './get-cam.service';

describe('GetCamService', () => {
  let service: GetCamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetCamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
