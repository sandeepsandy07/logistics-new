import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillableNonbillableReportComponent } from './billable-nonbillable-report.component';

describe('BillableNonbillableReportComponent', () => {
  let component: BillableNonbillableReportComponent;
  let fixture: ComponentFixture<BillableNonbillableReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillableNonbillableReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillableNonbillableReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
