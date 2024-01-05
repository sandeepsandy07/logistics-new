import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaLoadingViewComponent } from './da-loading-view.component';

describe('DaLoadingViewComponent', () => {
  let component: DaLoadingViewComponent;
  let fixture: ComponentFixture<DaLoadingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaLoadingViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaLoadingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
