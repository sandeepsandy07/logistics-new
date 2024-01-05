import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaListPeComponent } from './da-list-pe.component';

describe('DaListPeComponent', () => {
  let component: DaListPeComponent;
  let fixture: ComponentFixture<DaListPeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaListPeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaListPeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
