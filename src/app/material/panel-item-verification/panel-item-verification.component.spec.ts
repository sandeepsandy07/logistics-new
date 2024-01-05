import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelItemVerificationComponent } from './panel-item-verification.component';

describe('PanelItemVerificationComponent', () => {
  let component: PanelItemVerificationComponent;
  let fixture: ComponentFixture<PanelItemVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelItemVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelItemVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
