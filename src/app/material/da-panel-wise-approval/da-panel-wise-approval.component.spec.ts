import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaPanelWiseApprovalComponent } from './da-panel-wise-approval.component';

describe('DaPanelWiseApprovalComponent', () => {
  let component: DaPanelWiseApprovalComponent;
  let fixture: ComponentFixture<DaPanelWiseApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaPanelWiseApprovalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaPanelWiseApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
