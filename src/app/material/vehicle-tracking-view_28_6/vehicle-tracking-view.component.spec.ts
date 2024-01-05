import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleTrackingViewComponent } from './vehicle-tracking-view.component';

describe('VehicleTrackingViewComponent', () => {
  let component: VehicleTrackingViewComponent;
  let fixture: ComponentFixture<VehicleTrackingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleTrackingViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleTrackingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
