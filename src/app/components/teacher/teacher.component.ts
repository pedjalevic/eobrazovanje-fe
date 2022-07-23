import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import Teacher from 'src/app/models/teacher';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { NotificationService } from 'src/app/services/notification-service/notification-service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';
import { ModelDialogComponent } from '../model-dialog/model-dialog.component';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  // styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit, OnDestroy {

  teacher: Teacher;
  searchText;
  activeTab = 1;
  teachersList; any;
  teachersListData: any;
  currentUser: any;
  teacherRole = false;
  public teacherForm: FormGroup;
  private subscription: Subscription;
  dirty = false;

  constructor(
    private authenticationService: AuthenticationService,
    private teacherService: TeacherService,
    private modalService: NgbModal,
    private toastr: NotificationService
    ) {
    }

  ngOnInit() {
    this.createForm();
    this.authenticationService.getMe().subscribe(data => {
      this.teacher = data;
    });

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser.roles == 'ROLE_TEACHER') {
      this.changTab(2);
      this.teacherRole = true;
      this.getTeacherStorage();
      if (this.dirty !== true) {
        this.getTeacher(this.currentUser.id);
      }
    } else {
      this.getTeacherList();
      this.getTeacherStorage();
    }


    this.subscription = this.teacherForm.valueChanges.subscribe(x => {
      this.dirty = true;
      sessionStorage.setItem('teacherForm', JSON.stringify(this.prepareData()));
      sessionStorage.setItem('teacherFormDirty', JSON.stringify(this.dirty));
    });
  }

  createForm() {
    this.teacherForm =  new FormGroup({
      id: new FormControl(0),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      personalIdNumber: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      academicTitle: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required)
   });
  }

  onTeacherSelect(id: any) {
    this.checkFormDirty(id);
  }

  changTab(activeTab: any) {
    this.activeTab = activeTab;
  }

  getTeacher( id: any) {
    this.teacherService.getTeacher(id).subscribe(
      resp => {
        this.setFormValue(resp);
        this.dirty = false;
        sessionStorage.setItem('adminFormDirty', JSON.stringify(this.dirty));
      }
    );
  }

  getTeacherList() {
    this.teacherService.getTeachers().subscribe((resp) => {
        this.teachersList = this.teachersListData = resp.content;
      }
    );
  }

  saveTeacher() {
    if (this.teacherForm.valid) {
      const data = this.prepareData();
      this.teacherService.saveTeacher(
        data.academicTitle, data.email, data.firstName, data.id, data.lastName, data.personalIdNumber, data.phoneNumber, data.username
        ).subscribe(
        resp => {
          this.setFormValue(resp);
          if (this.currentUser.roles != 'ROLE_TEACHER') {
            this.toastr.showSuccess('Successfully saved!');
            this.getTeacherList();
          }
          this.dirty = false;
          sessionStorage.setItem('adminFormDirty', JSON.stringify(this.dirty));
        }
      );
    } else {
      this.getFormValidationErrors();
    }
  }

  getFormValidationErrors() {
    Object.keys(this.teacherForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.teacherForm.get(key).errors;
    if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          this.toastr.showError(key + ' ' + keyError);
        });
      }
    });
  }

  prepareData() {
    const data = this.teacherForm.value;
    return data;
  }

  setFormValue(data: any) {
    this.teacherForm.controls.id.setValue(data.id);
    this.teacherForm.controls.firstName.setValue(data.firstName);
    this.teacherForm.controls.lastName.setValue(data.lastName);
    this.teacherForm.controls.personalIdNumber.setValue(data.personalIdNumber);
    this.teacherForm.controls.username.setValue(data.username);
    this.teacherForm.controls.phoneNumber.setValue(data.phoneNumber);
    this.teacherForm.controls.academicTitle.setValue(data.academicTitle);
    this.teacherForm.controls.email.setValue(data.email);
  }

  resetForm() {
    this.teacherForm.controls.id.setValue(0);
    this.teacherForm.controls.firstName.setValue('');
    this.teacherForm.controls.lastName.setValue('');
    this.teacherForm.controls.personalIdNumber.setValue('');
    this.teacherForm.controls.username.setValue('');
    this.teacherForm.controls.phoneNumber.setValue('');
    this.teacherForm.controls.academicTitle.setValue('');
    this.teacherForm.controls.email.setValue('');
    if (this.activeTab !== 2) {
      this.changTab(2);
    }
    this.removeTeacherStorage();
  }

  deleteTeacher(id: any) {
    this.teacherService.deleteTeacher(id).subscribe(
      resp => {
        this.getTeacherList();
      }
    );
  }

  checkFormDirty(id) {
    if (this.dirty === true) {
      this.open(id);
    } else if (id > 0) {
      this.changTab(2);
      this.getTeacher(id);
    } else {
      this.resetForm();
    }
  }

  getTeacherStorage() {
    const form = JSON.parse(sessionStorage.getItem('teacherForm'));
    this.dirty = JSON.parse(sessionStorage.getItem('teacherFormDirty'));
    if (this.dirty === null || this.dirty === undefined ) {
      this.dirty = false;
    }
    if (form !== null && form !== undefined) {
      this.setFormValue(form);
    }
  }

  removeTeacherStorage() {
    sessionStorage.removeItem('teacherForm');
    sessionStorage.removeItem('teacherFormDirty');
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
        this.onTeacherSelect(id);
      }
    });
  }

}
