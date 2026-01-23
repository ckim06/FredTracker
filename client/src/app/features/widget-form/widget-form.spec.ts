import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetForm } from './widget-form';

describe('WidgetForm', () => {
  let component: WidgetForm;
  let fixture: ComponentFixture<WidgetForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetForm],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
