import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LicenseTypeComponent } from './license-type.component';

describe('LicenseTypeComponent', () => {
  let component: LicenseTypeComponent;
  let fixture: ComponentFixture<LicenseTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LicenseTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LicenseTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
