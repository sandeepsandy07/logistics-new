import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BomViewComponent } from './bom-view.component';

describe('BomViewComponent', () => {
  let component: BomViewComponent;
  let fixture: ComponentFixture<BomViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BomViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BomViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
