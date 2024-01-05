import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleMasterComponent } from './module-master.component';

describe('ModuleMasterComponent', () => {
  let component: ModuleMasterComponent;
  let fixture: ComponentFixture<ModuleMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
