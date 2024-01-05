import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaTrackingViewComponent } from './da-tracking-view.component';

describe('DaTrackingViewComponent', () => {
  let component: DaTrackingViewComponent;
  let fixture: ComponentFixture<DaTrackingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaTrackingViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaTrackingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
