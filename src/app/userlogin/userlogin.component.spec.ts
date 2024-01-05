import { ComponentFixture, TestBed } from '@angular/core/testing';

import { USERLOGINComponent } from './userlogin.component';

describe('USERLOGINComponent', () => {
  let component: USERLOGINComponent;
  let fixture: ComponentFixture<USERLOGINComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ USERLOGINComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(USERLOGINComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
