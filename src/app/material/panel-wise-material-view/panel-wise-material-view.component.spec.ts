import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelWiseMaterialViewComponent } from './panel-wise-material-view.component';

describe('PanelWiseMaterialViewComponent', () => {
  let component: PanelWiseMaterialViewComponent;
  let fixture: ComponentFixture<PanelWiseMaterialViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelWiseMaterialViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelWiseMaterialViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
