import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaDatailReportComponent } from './da-datail-report.component';

describe('DaDatailReportComponent', () => {
  let component: DaDatailReportComponent;
  let fixture: ComponentFixture<DaDatailReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaDatailReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaDatailReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
