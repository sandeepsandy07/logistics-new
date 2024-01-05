import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonBillPopupComponent } from './non-bill-popup.component';

describe('NonBillPopupComponent', () => {
  let component: NonBillPopupComponent;
  let fixture: ComponentFixture<NonBillPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonBillPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonBillPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
