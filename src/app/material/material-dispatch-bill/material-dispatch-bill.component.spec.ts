import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialDispatchBillComponent } from './material-dispatch-bill.component';

describe('MaterialDispatchBillComponent', () => {
  let component: MaterialDispatchBillComponent;
  let fixture: ComponentFixture<MaterialDispatchBillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialDispatchBillComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialDispatchBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
