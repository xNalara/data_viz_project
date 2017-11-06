import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { D3exampleComponent } from './d3example.component';

describe('D3exampleComponent', () => {
  let component: D3exampleComponent;
  let fixture: ComponentFixture<D3exampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ D3exampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(D3exampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
