import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackingInstructionComponent } from './packing-instruction.component';

describe('PackingInstructionComponent', () => {
  let component: PackingInstructionComponent;
  let fixture: ComponentFixture<PackingInstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackingInstructionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackingInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
