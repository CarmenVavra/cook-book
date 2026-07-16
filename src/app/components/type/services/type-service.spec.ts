import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TypeService } from './type-service';

describe('TypeService', () => {
  let service: TypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
