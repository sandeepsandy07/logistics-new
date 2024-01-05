import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DispatchAdviceListComponent } from './dispatch-advice-list.component';

describe('DispatchAdviceListComponent', () => {
  let component: DispatchAdviceListComponent;
  let fixture: ComponentFixture<DispatchAdviceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DispatchAdviceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DispatchAdviceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
