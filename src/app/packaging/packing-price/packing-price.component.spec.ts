import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingPriceComponent } from './packing-price.component';

describe('PackingPriceComponent', () => {
  let component: PackingPriceComponent;
  let fixture: ComponentFixture<PackingPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackingPriceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
