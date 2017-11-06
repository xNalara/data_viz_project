import { TestBed, inject } from '@angular/core/testing';

import { D3exampleService } from './d3example.service';

describe('D3exampleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [D3exampleService]
    });
  });

  it('should be created', inject([D3exampleService], (service: D3exampleService) => {
    expect(service).toBeTruthy();
  }));
});
