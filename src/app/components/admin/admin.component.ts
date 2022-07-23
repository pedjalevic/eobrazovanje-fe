import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { RoleTypes } from 'src/app/models/role';
import { AdminService } from 'src/app/services/admin/admin.service';
import { NotificationService } from 'src/app/services/notification-service/notification-service';
import { ModelDialogComponent } from '../model-dialog/model-dialog.component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  searchText;
  activeTab = 1;
  adminsList; any;
  currentUser: any;
  adminRole = false;
  public adminForm: FormGroup;
  private subscription: Subscription;
  dirty = false;
  roleType = RoleTypes;
  adminRoleType;
  selectedAdminUsername;

  constructor(
    private amdinService: AdminService,
    private modalService: NgbModal,
    private toastr: NotificationService,
    private router: Router
    ) {
      this.adminRoleType = this.roleType.ROLE_ADMIN;
    }

  ngOnInit() {
    this.createForm();
    this.resetForm();

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser.roles == 'ROLE_ADMIN') {
      this.getAdminList();
      this.changTab(1);
      this.adminRole = true;
      this.getAdminStorage();
    } else {
      this.toastr.showError('Successfully deleted!');
      this.router.navigate(['']);
    }


    this.subscription = this.adminForm.valueChanges.subscribe(x => {
      this.dirty = true;
      sessionStorage.setItem('adminForm', JSON.stringify(this.prepareData()));
      sessionStorage.setItem('adminFormDirty', JSON.stringify(this.dirty));
    });
  }

  createForm() {
    this.adminForm =  new FormGroup({
      id: new FormControl(0),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      personalIdNumber: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required),
      role: new FormControl(''),
      email: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required)
   });
  }

  onAdminSelect(id: any, name?: any) {
    if (name !== undefined) {
      this.selectedAdminUsername = name;
    }
    this.checkFormDirty(id);
  }

  changTab(activeTab: any) {
    this.activeTab = activeTab;
  }

  getAdmin( id: any) {
    this.amdinService.getAdmin(this.selectedAdminUsername).subscribe(
      resp => {
        this.setFormValue(resp);
        this.dirty = false;
        sessionStorage.setItem('adminFormDirty', JSON.stringify(this.dirty));
      }
    );
  }

  getAdminList() {
    this.amdinService.getAdmins().subscribe((resp) => {
        const admins = [];
        for (const item in resp.content ) {
          if (item !== undefined) {
            if (resp.content[item].roles[0].name == 'ROLE_ADMIN') {
              admins.push(resp.content[item]);
            }
          }
        }
        this.adminsList = admins;
      }
    );
  }

  saveAdmin() {
    if (this.adminForm.valid) {
      const data = this.prepareData();
      this.amdinService.saveAdmin(
        data.email, data.firstName, data.id, data.lastName, data.personalIdNumber, data.phoneNumber, data.username, data.role
        ).subscribe(
        resp => {
          this.setFormValue(resp);
          this.toastr.showSuccess('Successfully saved!');
          this.getAdminList();
          this.dirty = false;
          sessionStorage.setItem('adminFormDirty', JSON.stringify(this.dirty));
        }
      );
    } else {
      this.getFormValidationErrors();
    }
  }

  getFormValidationErrors() {
    Object.keys(this.adminForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.adminForm.get(key).errors;
    if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          this.toastr.showError(key + ' ' + keyError);
        });
      }
    });
  }

  prepareData() {
    const data = this.adminForm.value;
    return data;
  }

  setFormValue(data: any) {
    this.adminForm.controls.id.setValue(data.id);
    this.adminForm.controls.firstName.setValue(data.firstName);
    this.adminForm.controls.lastName.setValue(data.lastName);
    this.adminForm.controls.personalIdNumber.setValue(data.personalIdNumber);
    this.adminForm.controls.username.setValue(data.username);
    this.adminForm.controls.phoneNumber.setValue(data.phoneNumber);
    this.adminForm.controls.role.setValue(this.adminRoleType);
    this.adminForm.controls.email.setValue(data.email);
  }

  resetForm() {
    this.adminForm.controls.id.setValue(0);
    this.adminForm.controls.firstName.setValue('');
    this.adminForm.controls.lastName.setValue('');
    this.adminForm.controls.personalIdNumber.setValue('');
    this.adminForm.controls.username.setValue('');
    this.adminForm.controls.phoneNumber.setValue('');
    this.adminForm.controls.role.setValue(this.adminRoleType);
    this.adminForm.controls.email.setValue('');
    if (this.activeTab !== 2) {
      this.changTab(2);
    }
    this.removeAdminStorage();
  }

  deleteAdmin(id: any) {
    this.amdinService.deleteAdmin(id).subscribe(
      resp => {
        this.getAdminList();
        this.toastr.showSuccess('Successfully deleted!');
      }
    );
  }

  checkFormDirty(id) {
    if (this.dirty === true) {
      this.open(id);
    } else if (id > 0) {
      this.changTab(2);
      this.getAdmin(id);
    } else {
      this.resetForm();
    }
  }

  getAdminStorage() {
    const form = JSON.parse(sessionStorage.getItem('adminForm'));
    this.dirty = JSON.parse(sessionStorage.getItem('adminFormDirty'));
    if (this.dirty === null || this.dirty === undefined ) {
      this.dirty = false;
    }
    if (form !== null && form !== undefined) {
      this.setFormValue(form);
    }
  }

  removeAdminStorage() {
    sessionStorage.removeItem('adminForm');
    sessionStorage.removeItem('adminFormDirty');
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
        this.onAdminSelect(id);
      }
    });
  }

}
