import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaRemarksComponent } from './da-remarks.component';

describe('DaRemarksComponent', () => {
  let component: DaRemarksComponent;
  let fixture: ComponentFixture<DaRemarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaRemarksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaRemarksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
