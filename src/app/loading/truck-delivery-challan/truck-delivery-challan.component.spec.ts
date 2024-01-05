import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckDeliveryChallanComponent } from './truck-delivery-challan.component';

describe('TruckDeliveryChallanComponent', () => {
  let component: TruckDeliveryChallanComponent;
  let fixture: ComponentFixture<TruckDeliveryChallanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckDeliveryChallanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckDeliveryChallanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
