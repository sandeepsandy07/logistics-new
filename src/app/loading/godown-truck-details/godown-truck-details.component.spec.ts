import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GodownTruckDetailsComponent } from './godown-truck-details.component';

describe('GodownTruckDetailsComponent', () => {
  let component: GodownTruckDetailsComponent;
  let fixture: ComponentFixture<GodownTruckDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GodownTruckDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GodownTruckDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
