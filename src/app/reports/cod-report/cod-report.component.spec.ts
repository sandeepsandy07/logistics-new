import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodReportComponent } from './cod-report.component';

describe('CodReportComponent', () => {
  let component: CodReportComponent;
  let fixture: ComponentFixture<CodReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
