import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaRevisionComponent } from './da-revision.component';

describe('DaRevisionComponent', () => {
  let component: DaRevisionComponent;
  let fixture: ComponentFixture<DaRevisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaRevisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaRevisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
