import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TruckRequestComponent } from './truck-request.component';

describe('TruckRequestComponent', () => {
  let component: TruckRequestComponent;
  let fixture: ComponentFixture<TruckRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TruckRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TruckRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
