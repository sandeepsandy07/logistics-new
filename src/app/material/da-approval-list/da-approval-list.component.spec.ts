import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaApprovalListComponent } from './da-approval-list.component';

describe('DaApprovalListComponent', () => {
  let component: DaApprovalListComponent;
  let fixture: ComponentFixture<DaApprovalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaApprovalListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaApprovalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
