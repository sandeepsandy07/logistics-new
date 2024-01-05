import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxTypeComponent } from './box-type.component';

describe('BoxTypeComponent', () => {
  let component: BoxTypeComponent;
  let fixture: ComponentFixture<BoxTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
