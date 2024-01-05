import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreightModeComponent } from './freight-mode.component';

describe('FreightModeComponent', () => {
  let component: FreightModeComponent;
  let fixture: ComponentFixture<FreightModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreightModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreightModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
