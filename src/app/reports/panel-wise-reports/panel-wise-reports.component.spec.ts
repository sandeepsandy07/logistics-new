import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelWiseReportsComponent } from './panel-wise-reports.component';

describe('PanelWiseReportsComponent', () => {
  let component: PanelWiseReportsComponent;
  let fixture: ComponentFixture<PanelWiseReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelWiseReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelWiseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
