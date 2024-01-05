import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransporterDetailsComponent } from './transporter-details.component';

describe('TransporterDetailsComponent', () => {
  let component: TransporterDetailsComponent;
  let fixture: ComponentFixture<TransporterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransporterDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransporterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
