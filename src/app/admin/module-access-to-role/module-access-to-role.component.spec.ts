import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleAccessToRoleComponent } from './module-access-to-role.component';

describe('ModuleAccessToRoleComponent', () => {
  let component: ModuleAccessToRoleComponent;
  let fixture: ComponentFixture<ModuleAccessToRoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleAccessToRoleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleAccessToRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
