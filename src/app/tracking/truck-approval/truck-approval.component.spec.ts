import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckApprovalComponent } from './truck-approval.component';

describe('TruckApprovalComponent', () => {
  let component: TruckApprovalComponent;
  let fixture: ComponentFixture<TruckApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
