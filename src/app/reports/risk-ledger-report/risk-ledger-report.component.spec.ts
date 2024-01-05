import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskLedgerReportComponent } from './risk-ledger-report.component';

describe('RiskLedgerReportComponent', () => {
  let component: RiskLedgerReportComponent;
  let fixture: ComponentFixture<RiskLedgerReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskLedgerReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskLedgerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
