import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaPanelVerifyListComponent } from './da-panel-verify-list.component';

describe('DaPanelVerifyListComponent', () => {
  let component: DaPanelVerifyListComponent;
  let fixture: ComponentFixture<DaPanelVerifyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaPanelVerifyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaPanelVerifyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
