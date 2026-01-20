import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FredTable } from './table';

describe('Table', () => {
  let component: FredTable;
  let fixture: ComponentFixture<FredTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FredTable],
    }).compileComponents();

    fixture = TestBed.createComponent(FredTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
