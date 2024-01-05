import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaApprovalComponent } from './da-approval.component';

describe('DaApprovalComponent', () => {
  let component: DaApprovalComponent;
  let fixture: ComponentFixture<DaApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
