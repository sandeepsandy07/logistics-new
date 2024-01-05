import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchAdviceDetailComponent } from './dispatch-advice-detail.component';

describe('DispatchAdviceDetailComponent', () => {
  let component: DispatchAdviceDetailComponent;
  let fixture: ComponentFixture<DispatchAdviceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchAdviceDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchAdviceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
