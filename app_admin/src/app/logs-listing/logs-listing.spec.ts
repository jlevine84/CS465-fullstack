import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsListing } from './logs-listing';

describe('LogsListing', () => {
  let component: LogsListing;
  let fixture: ComponentFixture<LogsListing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogsListing],
    }).compileComponents();

    fixture = TestBed.createComponent(LogsListing);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
