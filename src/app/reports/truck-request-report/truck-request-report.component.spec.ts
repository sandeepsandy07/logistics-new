import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckRequestReportComponent } from './truck-request-report.component';

describe('TruckRequestReportComponent', () => {
  let component: TruckRequestReportComponent;
  let fixture: ComponentFixture<TruckRequestReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckRequestReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckRequestReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
