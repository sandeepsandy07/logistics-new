import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingCostReportComponent } from './packing-cost-report.component';

describe('PackingCostReportComponent', () => {
  let component: PackingCostReportComponent;
  let fixture: ComponentFixture<PackingCostReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackingCostReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingCostReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
