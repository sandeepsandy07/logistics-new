import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporterProviderCostVerificationComponent } from './transporter-provider-cost-verification.component';

describe('TransporterProviderCostVerificationComponent', () => {
  let component: TransporterProviderCostVerificationComponent;
  let fixture: ComponentFixture<TransporterProviderCostVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransporterProviderCostVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransporterProviderCostVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
