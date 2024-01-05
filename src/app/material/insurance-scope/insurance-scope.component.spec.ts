import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceScopeComponent } from './insurance-scope.component';

describe('InsuranceScopeComponent', () => {
  let component: InsuranceScopeComponent;
  let fixture: ComponentFixture<InsuranceScopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsuranceScopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
