import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import Engagements, { EngagementType } from 'src/app/models/engagements';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { CoursesService } from 'src/app/services/courses/courses.service';
import { EngagementsService } from 'src/app/services/engagements/engagements.service';
import { NotificationService } from 'src/app/services/notification-service/notification-service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { ModelDialogComponent } from '../model-dialog/model-dialog.component';

@Component({
  selector: 'app-engagements',
  templateUrl: './engagements.component.html',
  // styleUrls: ['./engagements.component.css']
})
export class EngagementsComponent implements OnInit, OnDestroy {

  engagements: Engagements;
  engagementTypes = EngagementType;
  searchText;
  activeTab = 1;
  engagementsList; any;
  currentUser: any;
  adminRole = false;
  public engagementForm: FormGroup;
  private subscription: Subscription;
  dirty = false;
  coursesList: any;
  teachersList: any;

  constructor(
    private engagementsService: EngagementsService,
    private modalService: NgbModal,
    private toastr: NotificationService,
    private coursesService: CoursesService,
    private teachersService: TeacherService
    ) {

    }

  ngOnInit() {
    this.createForm();

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser.roles == 'ROLE_ADMIN') {
      this.adminRole = true;
      this.getEngagements();
      this.getTeachersList();
      this.getCoursesList();
      this.getEngagementStorage();
    }


    this.subscription = this.engagementForm.valueChanges.subscribe(x => {
      this.dirty = true;
      sessionStorage.setItem('engagementForm', JSON.stringify(this.prepareData()));
      sessionStorage.setItem('engagementFormDirty', JSON.stringify(this.dirty));
    });
  }

  createForm() {
    this.engagementForm =  new FormGroup({
      id: new FormControl(0),
      engagementType: new FormControl('', Validators.required),
      course: new FormControl('', Validators.required),
      teacher: new FormControl('', Validators.required)
   });
  }

  onEngagementSelect(id: any) {
    this.checkFormDirty(id);
  }

  changTab(activeTab: any) {
    this.activeTab = activeTab;
  }

  getEngagement( id: any) {
    this.engagementsService.getEngagement(id).subscribe(
      resp => {
        this.setFormValue(resp);
        this.dirty = false;
        sessionStorage.setItem('engagementFormDirty', JSON.stringify(this.dirty));
      }
    );
  }

  getEngagements() {
    this.engagementsService.getEngagements().subscribe((resp) => {
        this.engagementsList = resp.content;
      }
    );
  }

  getCoursesList() {
    this.coursesService.getCourses().subscribe((resp) => {
        this.coursesList = resp.content;
      }
    );
  }

  getTeachersList() {
    this.teachersService.getTeachers().subscribe((resp) => {
        this.teachersList = resp.content;
      }
    );
  }


  saveEngagement() {
    if (this.engagementForm.valid) {
      const data = this.prepareData();
      data.course = { 'id': data.course};
      data.teacher = { 'id': data.teacher};
      this.engagementsService.saveEngagement(data.id, data.engagementType, data.course, data.teacher).subscribe(
        resp => {
          this.setFormValue(resp);
          if (this.currentUser.roles != 'ROLE_STUDENT') {
            this.toastr.showSuccess('Successfully saved!');
            this.getEngagements();
          }
          this.dirty = false;
          sessionStorage.setItem('engagementFormDirty', JSON.stringify(this.dirty));
        }
      );
    } else {
      this.getFormValidationErrors();
    }
  }

  getFormValidationErrors() {
    Object.keys(this.engagementForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.engagementForm.get(key).errors;
    if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          this.toastr.showError(key + ' ' + keyError);
        });
      }
    });
  }

  prepareData() {
    const data = this.engagementForm.value;
    return data;
  }

  setFormValue(data: any) {
    this.engagementForm.controls.id.setValue(data.id);
    this.engagementForm.controls.engagementType.setValue(data.engagementType);
    this.engagementForm.controls.course.setValue(data.course.id);
    this.engagementForm.controls.teacher.setValue(data.teacher.id);
  }

  resetForm() {
    this.engagementForm.controls.id.setValue(0);
    this.engagementForm.controls.engagementType.setValue(null);
    this.engagementForm.controls.course.setValue('');
    this.engagementForm.controls.teacher.setValue('');
    if (this.activeTab !== 2) {
      this.changTab(2);
    }
    this.removeEngagementStorage();
  }

  checkFormDirty(id) {
    if (this.dirty === true) {
      this.open(id);
    } else if (id > 0) {
      this.changTab(2);
      this.getEngagement(id);
    } else {
      this.resetForm();
    }
  }

  deleteEngagement(id: any) {
    this.engagementsService.deleteEngagement(id).subscribe(
      resp => {
        this.toastr.showSuccess('Uspešno obrisano!');
        this.getEngagements();
      }
    );
  }

  getEngagementStorage() {
    const form = JSON.parse(sessionStorage.getItem('engagementForm'));
    this.dirty = JSON.parse(sessionStorage.getItem('engagementFormDirty'));
    if (this.dirty === null || this.dirty === undefined ) {
      this.dirty = false;
    }
    if (form !== null && form !== undefined) {
      this.setFormValue(form);
    }
  }

  removeEngagementStorage() {
    sessionStorage.removeItem('engagementForm');
    sessionStorage.removeItem('engagementFormDirty');
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
        this.onEngagementSelect(id);
      }
    });
  }

}
