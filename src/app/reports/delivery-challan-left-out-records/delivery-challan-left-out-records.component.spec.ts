import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryChallanLeftOutRecordsComponent } from './delivery-challan-left-out-records.component';

describe('DeliveryChallanLeftOutRecordsComponent', () => {
  let component: DeliveryChallanLeftOutRecordsComponent;
  let fixture: ComponentFixture<DeliveryChallanLeftOutRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeliveryChallanLeftOutRecordsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryChallanLeftOutRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
