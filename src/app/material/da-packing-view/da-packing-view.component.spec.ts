import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaPackingViewComponent } from './da-packing-view.component';

describe('DaPackingViewComponent', () => {
  let component: DaPackingViewComponent;
  let fixture: ComponentFixture<DaPackingViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaPackingViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaPackingViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
