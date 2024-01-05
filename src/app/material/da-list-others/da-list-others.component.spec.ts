import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaListOthersComponent } from './da-list-others.component';

describe('DaListOthersComponent', () => {
  let component: DaListOthersComponent;
  let fixture: ComponentFixture<DaListOthersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaListOthersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaListOthersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
