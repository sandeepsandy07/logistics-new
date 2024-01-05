import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleWorkFlowComponent } from './module-work-flow.component';

describe('ModuleWorkFlowComponent', () => {
  let component: ModuleWorkFlowComponent;
  let fixture: ComponentFixture<ModuleWorkFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleWorkFlowComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleWorkFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
