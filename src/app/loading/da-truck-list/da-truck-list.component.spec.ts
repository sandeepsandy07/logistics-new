import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaTruckListComponent } from './da-truck-list.component';

describe('DaTruckListComponent', () => {
  let component: DaTruckListComponent;
  let fixture: ComponentFixture<DaTruckListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaTruckListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaTruckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
