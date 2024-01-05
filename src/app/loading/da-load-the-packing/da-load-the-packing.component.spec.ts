import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaLoadThePackingComponent } from './da-load-the-packing.component';

describe('DaLoadThePackingComponent', () => {
  let component: DaLoadThePackingComponent;
  let fixture: ComponentFixture<DaLoadThePackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaLoadThePackingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaLoadThePackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
