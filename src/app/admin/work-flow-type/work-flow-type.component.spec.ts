import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkFlowTypeComponent } from './work-flow-type.component';

describe('WorkFlowTypeComponent', () => {
  let component: WorkFlowTypeComponent;
  let fixture: ComponentFixture<WorkFlowTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkFlowTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkFlowTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
