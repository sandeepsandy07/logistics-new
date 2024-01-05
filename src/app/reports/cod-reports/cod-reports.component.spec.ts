import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodReportsComponent } from './cod-reports.component';

describe('CodReportsComponent', () => {
  let component: CodReportsComponent;
  let fixture: ComponentFixture<CodReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
