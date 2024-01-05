import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchModeComponent } from './dispatch-mode.component';

describe('DispatchModeComponent', () => {
  let component: DispatchModeComponent;
  let fixture: ComponentFixture<DispatchModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
