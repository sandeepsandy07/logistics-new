import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LooseItemVerificationComponent } from './loose-item-verification.component';

describe('LooseItemVerificationComponent', () => {
  let component: LooseItemVerificationComponent;
  let fixture: ComponentFixture<LooseItemVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LooseItemVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LooseItemVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
