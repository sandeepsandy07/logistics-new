import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelWiseMaterialComponent } from './panel-wise-material.component';

describe('PanelWiseMaterialComponent', () => {
  let component: PanelWiseMaterialComponent;
  let fixture: ComponentFixture<PanelWiseMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PanelWiseMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelWiseMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
