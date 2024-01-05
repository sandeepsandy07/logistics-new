import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingReportComponent } from './packing-report.component';

describe('PackingReportComponent', () => {
  let component: PackingReportComponent;
  let fixture: ComponentFixture<PackingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackingReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
