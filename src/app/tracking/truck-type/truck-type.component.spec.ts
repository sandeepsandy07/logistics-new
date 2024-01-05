import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckTypeComponent } from './truck-type.component';

describe('TruckTypeComponent', () => {
  let component: TruckTypeComponent;
  let fixture: ComponentFixture<TruckTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
