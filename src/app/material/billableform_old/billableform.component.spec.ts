import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillableformComponent } from './billableform.component';

describe('BillableformComponent', () => {
  let component: BillableformComponent;
  let fixture: ComponentFixture<BillableformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillableformComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BillableformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
