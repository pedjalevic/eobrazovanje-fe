import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamFailedComponent } from './exam-failed.component';

describe('ExamFailedComponent', () => {
  let component: ExamFailedComponent;
  let fixture: ComponentFixture<ExamFailedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamFailedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamFailedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
