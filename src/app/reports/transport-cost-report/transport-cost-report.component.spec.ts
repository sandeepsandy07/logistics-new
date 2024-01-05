import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportCostReportComponent } from './transport-cost-report.component';

describe('TransportCostReportComponent', () => {
  let component: TransportCostReportComponent;
  let fixture: ComponentFixture<TransportCostReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportCostReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportCostReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
