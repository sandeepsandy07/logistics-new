import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoxSizeComponent } from './box-size.component';

describe('BoxSizeComponent', () => {
  let component: BoxSizeComponent;
  let fixture: ComponentFixture<BoxSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoxSizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoxSizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
