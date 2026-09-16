import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dashshell } from './dashshell';

describe('Dashshell', () => {
  let component: Dashshell;
  let fixture: ComponentFixture<Dashshell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashshell],
    }).compileComponents();

    fixture = TestBed.createComponent(Dashshell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
