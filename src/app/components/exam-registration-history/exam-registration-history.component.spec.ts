import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamRegistrationHistoryComponent } from './exam-registration-history.component';

describe('ExamRegistrationHistoryComponent', () => {
  let component: ExamRegistrationHistoryComponent;
  let fixture: ComponentFixture<ExamRegistrationHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamRegistrationHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamRegistrationHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
