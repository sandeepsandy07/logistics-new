import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherTransactionsComponent } from './other-transactions.component';

describe('OtherTransactionsComponent', () => {
  let component: OtherTransactionsComponent;
  let fixture: ComponentFixture<OtherTransactionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherTransactionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
