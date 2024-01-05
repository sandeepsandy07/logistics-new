import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaDetailViewTabComponent } from './da-detail-view-tab.component';

describe('DaDetailViewTabComponent', () => {
  let component: DaDetailViewTabComponent;
  let fixture: ComponentFixture<DaDetailViewTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaDetailViewTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaDetailViewTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
