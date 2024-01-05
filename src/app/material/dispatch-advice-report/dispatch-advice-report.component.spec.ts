import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchAdviceReportComponent } from './dispatch-advice-report.component';

describe('DispatchAdviceReportComponent', () => {
  let component: DispatchAdviceReportComponent;
  let fixture: ComponentFixture<DispatchAdviceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchAdviceReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchAdviceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
