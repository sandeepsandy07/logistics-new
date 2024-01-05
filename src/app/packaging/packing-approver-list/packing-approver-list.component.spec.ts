import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingApproverListComponent } from './packing-approver-list.component';

describe('PackingApproverListComponent', () => {
  let component: PackingApproverListComponent;
  let fixture: ComponentFixture<PackingApproverListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackingApproverListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingApproverListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
