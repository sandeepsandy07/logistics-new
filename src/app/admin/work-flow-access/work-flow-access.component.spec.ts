import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowAccessComponent } from './work-flow-access.component';

describe('WorkFlowAccessComponent', () => {
  let component: WorkFlowAccessComponent;
  let fixture: ComponentFixture<WorkFlowAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFlowAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
