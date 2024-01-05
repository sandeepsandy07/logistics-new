import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportationScopeComponent } from './transportation-scope.component';

describe('TransportationScopeComponent', () => {
  let component: TransportationScopeComponent;
  let fixture: ComponentFixture<TransportationScopeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportationScopeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportationScopeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
