import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbDateStruct, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { ExamService } from 'src/app/services/exam/exam.service';
import { NotificationService } from 'src/app/services/notification-service/notification-service';
import { TermService } from 'src/app/services/term/term.service';
import { ModelDialogComponent } from '../model-dialog/model-dialog.component';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  // styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit, OnDestroy {

  searchText;
  activeTab = 1;
  examsList; any;
  currentUser: any;
  adminRole = false;
  teacherRole = false;
  public examForm: FormGroup;
  private subscription: Subscription;
  dirty = false;
  termList: any;
  courseList: any;

  selectedDate: NgbDateStruct;

  constructor(
    private examService: ExamService,
    private modalService: NgbModal,
    private toastr: NotificationService,
    private coursesService: CoursesService,
    private termService: TermService,
    private calendar: NgbCalendar,
    private parserFormatter: NgbDateParserFormatter,
    private router: Router
    ) {
      this.selectedDate = this.calendar.getToday();
    }

  ngOnInit() {
    this.createForm();

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser.roles == 'ROLE_ADMIN') {
      this.getExams();
      this.getTermsList();
      this.getCoursesList();
      this.getExamStorage();
    } else if (this.currentUser.roles == 'ROLE_TEACHER') {
      this.teacherRole = true;
      this.getTeacherCoursesList();
      this.getExamsTeacher(this.currentUser.id);
      this.getExamStorage();
    } else {
      this.router.navigate(['']);
    }


    this.subscription = this.examForm.valueChanges.subscribe(x => {
      this.dirty = true;
      sessionStorage.setItem('examForm', JSON.stringify(this.prepareData()));
      sessionStorage.setItem('examFormDirty', JSON.stringify(this.dirty));
    });
  }

  createForm() {
    this.examForm =  new FormGroup({
      id: new FormControl(0),
      location: new FormControl('', Validators.required),
      term: new FormControl('', Validators.required),
      course: new FormControl('', Validators.required),
      examDate: new FormControl('')
   });
  }

  onExamSelect(id: any) {
    this.checkFormDirty(id);
  }

  changTab(activeTab: any) {
    this.activeTab = activeTab;
  }

  getExam( id: any) {
    this.examService.getExam(id).subscribe(
      resp => {
        this.setFormValue(resp);
        this.dirty = false;
        sessionStorage.setItem('examFormDirty', JSON.stringify(this.dirty));
      }
    );
  }

  getExams() {
    this.examService.getExams().subscribe((resp) => {
        this.examsList = resp.content;
      }
    );
  }
  getExamsTeacher(id) {
    this.examService.getExamsTeacher(id).subscribe((resp) => {
        this.examsList = resp.content;
      }
    );
  }

  getCoursesList() {
    this.coursesService.getCourses().subscribe((resp) => {
        this.courseList = resp.content;
      }
    );
  }

  getTeacherCoursesList() {
    this.coursesService.getTeacherCourses(this.currentUser.id).subscribe((resp) => {
        this.courseList = resp.content;
      }
    );
  }

  getTermsList() {
    this.termService.getTerms().subscribe((resp) => {
        this.termList = resp.content;
      }
    );
  }


  saveExam() {
    if (this.examForm.valid) {
      const data = Object.assign({ }, this.prepareData());
      if (this.selectedDate === undefined && this.selectedDate === null) {
        this.toastr.showSuccess('Dates required!');
      } else {
        data.course = { 'id': data.course};
        data.term = { 'id': data.term};
        data.examDate = this.parserFormatter.format(this.selectedDate);
        this.examService.saveExam(data.id, data.term, data.course, data.location, data.examDate).subscribe(
          resp => {
            this.setFormValue(resp);
            if (this.currentUser.roles != 'ROLE_STUDENT') {
              this.toastr.showSuccess('Successfully saved!');
              if (this.teacherRole) {
                this.getExamsTeacher(this.currentUser.id);
              } else {
                this.getExams();
              }
            }
            this.dirty = false;
            sessionStorage.setItem('examFormDirty', JSON.stringify(this.dirty));
          }
        );
      }
    } else {
      this.getFormValidationErrors();
    }
  }

  getFormValidationErrors() {
    Object.keys(this.examForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.examForm.get(key).errors;
    if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          this.toastr.showError(key + ' ' + keyError);
        });
      }
    });
  }

  prepareData() {
    const data = this.examForm.value;
    return data;
  }

  setFormValue(data: any) {
    this.examForm.controls.id.setValue(data.id);
    this.examForm.controls.location.setValue(data.location);
    this.selectedDate = this.changeDataFormat(data.examDate);
    this.examForm.controls.examDate.setValue(this.selectedDate);
    if (data.course.id !== undefined && data.course.id !== null) {
      this.examForm.get('course').patchValue(data.course.id);
    } else {
      this.examForm.controls.course.setValue(data.course);
    }
    if (data.term.id !== undefined && data.term.id !== null) {
      this.examForm.get('term').patchValue(data.term.id);
    } else {
      this.examForm.controls.term.setValue(data.term);
    }
  }

  resetForm() {
    this.examForm.controls.id.setValue(0);
    this.examForm.controls.location.setValue('');
    this.selectedDate = this.calendar.getToday();
    this.examForm.controls.examDate.setValue(this.selectedDate);
    this.examForm.controls.course.setValue('');
    this.examForm.controls.term.setValue('');
    if (this.activeTab !== 2) {
      this.changTab(2);
    }
    this.removeExamStorage();
  }

  checkFormDirty(id) {
    if (this.dirty === true) {
      this.open(id);
    } else if (id > 0) {
      this.changTab(2);
      this.getExam(id);
    } else {
      this.resetForm();
    }
  }

  deleteExam(id: any) {
    this.examService.deleteExam(id).subscribe(
      resp => {
        this.toastr.showSuccess('Uspešno obrisano!');
        this.getExams();
      }
    );
  }

  getExamStorage() {
    const form = JSON.parse(sessionStorage.getItem('examForm'));
    this.dirty = JSON.parse(sessionStorage.getItem('examFormDirty'));
    if (this.dirty === null || this.dirty === undefined ) {
      this.dirty = false;
    }
    if (form !== null && form !== undefined) {
      this.setFormValue(form);
    }
  }

  removeExamStorage() {
    sessionStorage.removeItem('examForm');
    sessionStorage.removeItem('examFormDirty');
    this.dirty = false;
  }

  changeDataFormat(data: any) {
    const model = this.calendar.getToday();
    if (data !== null && data !== undefined && typeof data !== 'object') {
      model.year = Number(data.slice(0,4));
      model.month = Number(data.slice(5,7));
      model.day = Number(data.slice(8,10));
    }
    if (typeof data === 'object') {
      return data;
    } else {
      return model;
    }
  }

  onChangeDate(value: any) {
    this.examForm.controls.examDate.setValue(value);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  open(id) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
    };
    const modalRef = this.modalService.open(ModelDialogComponent, ngbModalOptions);
    modalRef.result.then((userResponse) => {
      if (userResponse === true) {
        this.dirty = false;
        this.onExamSelect(id);
      }
    });
  }

}
