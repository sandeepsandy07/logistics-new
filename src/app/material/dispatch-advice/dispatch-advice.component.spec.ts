import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchAdviceComponent } from './dispatch-advice.component';

describe('DispatchAdviceComponent', () => {
  let component: DispatchAdviceComponent;
  let fixture: ComponentFixture<DispatchAdviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchAdviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
