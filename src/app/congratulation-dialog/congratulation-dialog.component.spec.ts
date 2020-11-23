import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CongratulationDialogComponent } from './congratulation-dialog.component';

describe('CongratulationDialogComponent', () => {
  let component: CongratulationDialogComponent;
  let fixture: ComponentFixture<CongratulationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CongratulationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CongratulationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
