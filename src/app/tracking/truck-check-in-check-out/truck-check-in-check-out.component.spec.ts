import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckCheckInCheckOutComponent } from './truck-check-in-check-out.component';

describe('TruckCheckInCheckOutComponent', () => {
  let component: TruckCheckInCheckOutComponent;
  let fixture: ComponentFixture<TruckCheckInCheckOutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckCheckInCheckOutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckCheckInCheckOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
