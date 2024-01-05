import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotLogisticsComponent } from './not-logistics.component';

describe('NotLogisticsComponent', () => {
  let component: NotLogisticsComponent;
  let fixture: ComponentFixture<NotLogisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotLogisticsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotLogisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
