import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskLedgerComponent } from './risk-ledger.component';

describe('RiskLedgerComponent', () => {
  let component: RiskLedgerComponent;
  let fixture: ComponentFixture<RiskLedgerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskLedgerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskLedgerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
