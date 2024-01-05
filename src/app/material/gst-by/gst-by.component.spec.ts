import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GstByComponent } from './gst-by.component';

describe('GstByComponent', () => {
  let component: GstByComponent;
  let fixture: ComponentFixture<GstByComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GstByComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GstByComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
