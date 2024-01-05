import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaFinanceApprovalComponent } from './da-finance-approval.component';

describe('DaFinanceApprovalComponent', () => {
  let component: DaFinanceApprovalComponent;
  let fixture: ComponentFixture<DaFinanceApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaFinanceApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaFinanceApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
