import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import StudyProgram, { StudyProgramType } from 'src/app/models/study-program';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { NotificationService } from 'src/app/services/notification-service/notification-service';
import { StudyProgramService } from 'src/app/services/study-program/study-program.service';
import { ModelDialogComponent } from '../model-dialog/model-dialog.component';

@Component({
  selector: 'app-study-programs',
  templateUrl: './study-programs.component.html',
  // styleUrls: ['./study-programs.component.css']
})
export class StudyProgramsComponent implements OnInit, OnDestroy {


  studyProgram: StudyProgram;
  studyProgramTypes = StudyProgramType;
  searchText;
  activeTab = 1;
  studyProgramsList: any;
  currentUser: any;
  adminRole = false;
  public studyProgramForm: FormGroup;
  private subscription: Subscription;
  dirty = false;
  coursesList: any;

  constructor(
    private authenticationService: AuthenticationService,
    private studyProgramService: StudyProgramService,
    private modalService: NgbModal,
    private toastr: NotificationService,
    private coursesService: CoursesService
    ) {

    }

  ngOnInit() {
    this.createForm();

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser.roles == 'ROLE_ADMIN') {
      this.adminRole = true;
      this.getStudyProgramList();
      this.getCoursesList();
      this.getStudyProgramStorage();
    }


    this.subscription = this.studyProgramForm.valueChanges.subscribe(x => {
      this.dirty = true;
      sessionStorage.setItem('studyProgramForm', JSON.stringify(this.prepareData()));
      sessionStorage.setItem('studyProgramFormDirty', JSON.stringify(this.dirty));
    });
  }

  createForm() {
    this.studyProgramForm =  new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),
      prefix: new FormControl('', Validators.required),
      studyField: new FormControl('', Validators.required),
      espbPoints: new FormControl('', Validators.required),
      studyProgramType: new FormControl('', Validators.required),
      courses: new FormControl('', Validators.required)
    });
  }

  onStudyProgramSelect(id: any) {
    this.checkFormDirty(id);
  }

  changTab(activeTab: any) {
    this.activeTab = activeTab;
  }

  getStudyProgram( id: any) {
    this.studyProgramService.getStudyProgram(id).subscribe(
      resp => {
        this.setFormValue(resp);
        this.dirty = false;
        sessionStorage.setItem('studyProgramFormDirty', JSON.stringify(this.dirty));
      }
    );
  }

  getStudyProgramList() {
    this.studyProgramService.getStudyPrograms().subscribe((resp) => {
        this.studyProgramsList = resp.content;
      }
    );
  }

  getCoursesList() {
    this.coursesService.getCourses().subscribe((resp) => {
        this.coursesList = resp.content;
      }
    );
  }

  saveStudyProgram() {
    if (this.studyProgramForm.valid) {
      const data = this.prepareData();
      this.studyProgramService.saveStudyProgram(
        data.id, data.name, data.prefix, data.studyField, data.espbPoints, data.studyProgramType, data.courses
      ).subscribe(
        resp => {
          this.setFormValue(resp);
          if (this.currentUser.roles != 'ROLE_STUDENT') {
            this.toastr.showSuccess('Successfully saved!');
            this.getStudyProgramList();
          }
          this.dirty = false;
          sessionStorage.setItem('studyProgramFormDirty', JSON.stringify(this.dirty));
        }
      );
    } else {
      this.getFormValidationErrors();
    }
  }

  getFormValidationErrors() {
    Object.keys(this.studyProgramForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.studyProgramForm.get(key).errors;
    if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          this.toastr.showError(key + ' ' + keyError);
        });
      }
    });
  }

  prepareData() {
    const data = this.studyProgramForm.value;
    return data;
  }

  setFormValue(data: any) {
    this.studyProgramForm.controls.id.setValue(data.id);
    this.studyProgramForm.controls.name.setValue(data.name);
    this.studyProgramForm.controls.prefix.setValue(data.prefix);
    this.studyProgramForm.controls.studyField.setValue(data.studyField);
    this.studyProgramForm.controls.espbPoints.setValue(data.espbPoints);
    this.studyProgramForm.controls.studyProgramType.setValue(data.studyProgramType);
    this.studyProgramForm.controls.courses.setValue(data.courses);
  }

  resetForm() {
    this.studyProgramForm.controls.id.setValue(0);
    this.studyProgramForm.controls.name.setValue('');
    this.studyProgramForm.controls.prefix.setValue('');
    this.studyProgramForm.controls.studyField.setValue('');
    this.studyProgramForm.controls.studyField.setValue('');
    this.studyProgramForm.controls.espbPoints.setValue('');
    this.studyProgramForm.controls.studyProgramType.setValue('');
    this.studyProgramForm.controls.courses.setValue('');
    if (this.activeTab !== 2) {
      this.changTab(2);
    }
    this.removeStudyProgramStorage();
  }

  checkFormDirty(id) {
    if (this.dirty === true) {
      this.open(id);
    } else if (id > 0) {
      this.changTab(2);
      this.getStudyProgram(id);
    } else {
      this.resetForm();
    }
  }

  deleteStudyProgram(id: any) {
    this.studyProgramService.deleteStudyProgram(id).subscribe(
      resp => {
        this.getStudyProgramList();
      }
    );
  }

  getStudyProgramStorage() {
    const form = JSON.parse(sessionStorage.getItem('studyProgramForm'));
    this.dirty = JSON.parse(sessionStorage.getItem('studyProgramFormDirty'));
    if (this.dirty === null || this.dirty === undefined ) {
      this.dirty = false;
    }
    if (form !== null && form !== undefined) {
      this.setFormValue(form);
    }
  }

  removeStudyProgramStorage() {
    sessionStorage.removeItem('studyProgramForm');
    sessionStorage.removeItem('studyProgramFormDirty');
    this.dirty = false;
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
        this.onStudyProgramSelect(id);
      }
    });
  }

}
