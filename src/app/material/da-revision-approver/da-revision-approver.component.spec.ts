import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaRevisionApproverComponent } from './da-revision-approver.component';

describe('DaRevisionApproverComponent', () => {
  let component: DaRevisionApproverComponent;
  let fixture: ComponentFixture<DaRevisionApproverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaRevisionApproverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaRevisionApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
