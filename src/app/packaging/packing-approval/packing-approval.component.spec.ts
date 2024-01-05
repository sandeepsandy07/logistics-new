import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingApprovalComponent } from './packing-approval.component';

describe('PackingApprovalComponent', () => {
  let component: PackingApprovalComponent;
  let fixture: ComponentFixture<PackingApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackingApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
