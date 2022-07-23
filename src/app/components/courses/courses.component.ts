import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import Courses, { Semester } from 'src/app/models/courses';
import { Years } from 'src/app/models/student';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { NotificationService } from 'src/app/services/notification-service/notification-service';
import { ModelDialogComponent } from '../model-dialog/model-dialog.component';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit, OnDestroy {
  course: Courses;
  semesters = Semester;
  yearsList = Years;
  searchText;
  activeTab = 1;
  coursesList; any;
  currentUser: any;
  adminRole = false;
  teacherRole = false;
  public courseForm: FormGroup;
  private subscription: Subscription;
  dirty = false;

  constructor(
    private authenticationService: AuthenticationService,
    private coursesService: CoursesService,
    private modalService: NgbModal,
    private toastr: NotificationService,
    private router: Router
    ) {

    }

  ngOnInit() {
    this.createForm();

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser.roles == 'ROLE_ADMIN') {
      this.adminRole = true;
      this.getCourses();
      this.getCourseStorage();
    } else if (this.currentUser.roles == 'ROLE_TEACHER') {
      this.teacherRole = true;
      this.getCourseStorage();
      this.getTeacherCourses();
    } else {
      this.router.navigate(['']);
    }


    this.subscription = this.courseForm.valueChanges.subscribe(x => {
      this.dirty = true;
      sessionStorage.setItem('courseForm', JSON.stringify(this.prepareData()));
      sessionStorage.setItem('courseFormDirty', JSON.stringify(this.dirty));
    });
  }

  createForm() {
    this.courseForm =  new FormGroup({
      id: new FormControl(0),
      espbPoints: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      semester: new FormControl('', Validators.required),
      year: new FormControl('', Validators.required)
   });
  }

  onCourseSelect(id: any) {
    this.checkFormDirty(id);
  }

  changTab(activeTab: any) {
    this.activeTab = activeTab;
  }

  getCourse( id: any) {
    this.coursesService.getCourse(id).subscribe(
      resp => {
        this.setFormValue(resp);
        this.dirty = false;
        sessionStorage.setItem('courseFormDirty', JSON.stringify(this.dirty));
      }
    );
  }

  getCourses() {
    this.coursesService.getCourses().subscribe((resp) => {
        this.coursesList = resp.content;
      }
    );
  }

  getTeacherCourses() {
    this.coursesService.getTeacherCourses(this.currentUser.id).subscribe((resp) => {
        this.coursesList = resp.content;
      }
    );
  }

  saveCourse() {
    if (this.courseForm.valid) {
      const data = this.prepareData();
      this.coursesService.saveCourse(data.espbPoints, data.id, data.name, data.semester, data.year).subscribe(
        resp => {
          this.setFormValue(resp);
          if (this.currentUser.roles != 'ROLE_STUDENT') {
            this.toastr.showSuccess('Successfully saved!');
            if (this.teacherRole) {
              this.getTeacherCourses();
            } else {
              this.getCourses();
            }
          }
          this.dirty = false;
          sessionStorage.setItem('courseFormDirty', JSON.stringify(this.dirty));
        }
      );
    } else {
      this.getFormValidationErrors();
    }
  }

  getFormValidationErrors() {
    Object.keys(this.courseForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.courseForm.get(key).errors;
    if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          this.toastr.showError(key + ' ' + keyError);
        });
      }
    });
  }

  prepareData() {
    const data = this.courseForm.value;
    return data;
  }

  setFormValue(data: any) {
    this.courseForm.controls.espbPoints.setValue(data.espbPoints);
    this.courseForm.controls.id.setValue(data.id);
    this.courseForm.controls.name.setValue(data.name);
    this.courseForm.controls.semester.setValue(data.semester);
    this.courseForm.controls.year.setValue(data.year);
  }

  resetForm() {
    this.courseForm.controls.espbPoints.setValue(null);
    this.courseForm.controls.id.setValue(0);
    this.courseForm.controls.name.setValue('');
    this.courseForm.controls.semester.setValue('');
    this.courseForm.controls.year.setValue('');
    if (this.activeTab !== 2) {
      this.changTab(2);
    }
    this.removeCourseStorage();
  }

  checkFormDirty(id) {
    if (this.dirty === true) {
      this.open(id);
    } else if (id > 0) {
      this.changTab(2);
      this.getCourse(id);
    } else {
      this.resetForm();
    }
  }

  deleteCourse(id: any) {
    this.coursesService.deleteCourse(id).subscribe(
      resp => {
        this.toastr.showSuccess('Successfully deleted!');
        this.getCourses();
      }
    );
  }

  getCourseStorage() {
    const form = JSON.parse(sessionStorage.getItem('courseForm'));
    this.dirty = JSON.parse(sessionStorage.getItem('courseFormDirty'));
    if (this.dirty === null || this.dirty === undefined ) {
      this.dirty = false;
    }
    if (form !== null && form !== undefined) {
      this.setFormValue(form);
    }
  }

  removeCourseStorage() {
    sessionStorage.removeItem('courseForm');
    sessionStorage.removeItem('courseFormDirty');
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
        this.onCourseSelect(id);
      }
    });
  }

}
