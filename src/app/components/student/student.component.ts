import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import Student, { FinancialStatus, Years } from 'src/app/models/student';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { NotificationService } from 'src/app/services/notification-service/notification-service';
import { StudentService } from 'src/app/services/student/student.service';
import { StudyProgramService } from 'src/app/services/study-program/study-program.service';
import { ModelDialogComponent } from '../model-dialog/model-dialog.component';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  // styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit, OnDestroy {


  student: Student;
  yearsList = Years;
  financialStatusList = FinancialStatus;
  searchText;
  activeTab = 1;
  studentsList; any;
  studentsListData: any;
  currentUser: any;
  studentRole = false;
  public studentForm: FormGroup;
  private subscription: Subscription;
  dirty = false;
  studyProgramsList: any;

  constructor(
    private authenticationService: AuthenticationService,
    private studentService: StudentService,
    private studyProgramService: StudyProgramService,
    private modalService: NgbModal,
    private toastr: NotificationService
    ) {

    }

  ngOnInit() {
    this.createForm();
    this.authenticationService.getMe().subscribe(data => {
      this.student = data;
    });

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser.roles == 'ROLE_STUDENT') {
      this.changTab(2);
      this.studentRole = true;
      this.getStudentStorage();
      if (this.dirty !== true) {
        this.getStudent(this.currentUser.id);
      }
    } else {
      this.getStudentList();
      this.getStudentStorage();
      this.getStudyProgramList();
    }

    this.subscription = this.studentForm.valueChanges.subscribe(x => {
      this.dirty = true;
      sessionStorage.setItem('studentForm', JSON.stringify(this.prepareData()));
      sessionStorage.setItem('studentFormDirty', JSON.stringify(this.dirty));
    });
  }

  createForm() {
    this.studentForm =  new FormGroup({
      id: new FormControl(0),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      personalIdNumber: new FormControl('', Validators.required),
      phoneNumber: new FormControl(''),
      schoolIdNumber: new FormControl(''),
      email: new FormControl(''),
      username: new FormControl('', Validators.required),
      studyProgram: new FormControl('', Validators.required),
      studyProgramText: new FormControl(''),
      currentStudyYear: new FormControl('', Validators.required),
      financialStatus: new FormControl('', Validators.required)
   });
  }

  onStudentSelect(id: any) {
    this.checkFormDirty(id);
  }

  changTab(activeTab: any) {
    this.activeTab = activeTab;
  }

  getStudent( id: any) {
    this.studentService.getStudent(id).subscribe(
      resp => {
        this.setFormValue(resp);
        this.dirty = false;
        sessionStorage.setItem('studentFormDirty', JSON.stringify(this.dirty));
      }
    );
  }

  getStudentList() {
    this.studentService.getStudents().subscribe((resp) => {
        this.studentsList = this.studentsListData = resp.content;
      }
    );
  }

  getStudyProgramList() {
    this.studyProgramService.getStudyPrograms().subscribe((resp) => {
        this.studyProgramsList = resp.content;
      }
    );
  }


  saveStudent() {
    if (this.studentForm.valid) {
      const data = this.prepareData();
      data.studyProgram = {
        'id': data.studyProgram
      };
      this.studentService.saveStudent(
          data.email, data.firstName, data.id, data.lastName, data.personalIdNumber, data.phoneNumber,
          data.studyProgram, data.username, data.currentStudyYear, data.financialStatus
        ).subscribe(
        resp => {
          this.setFormValue(resp);
          this.toastr.showSuccess('Successfully saved!');
          if (this.currentUser.roles != 'ROLE_STUDENT') {
            this.getStudentList();
          }
          this.dirty = false;
          sessionStorage.setItem('studentFormDirty', JSON.stringify(this.dirty));
        }
      );
    } else {
      this.getFormValidationErrors();
    }
  }

  getFormValidationErrors() {
    Object.keys(this.studentForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.studentForm.get(key).errors;
    if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          this.toastr.showError(key + ' ' + keyError);
        });
      }
    });
  }

  prepareData() {
    const data = this.studentForm.value;
    return data;
  }

  setFormValue(data: any) {
    this.studentForm.controls.id.setValue(data.id);
    this.studentForm.controls.firstName.setValue(data.firstName);
    this.studentForm.controls.lastName.setValue(data.lastName);
    this.studentForm.controls.personalIdNumber.setValue(data.personalIdNumber);
    this.studentForm.controls.username.setValue(data.username);
    this.studentForm.controls.phoneNumber.setValue(data.phoneNumber);
    this.studentForm.controls.schoolIdNumber.setValue(data.schoolIdNumber);
    this.studentForm.controls.email.setValue(data.email);
    if (data.studyProgram.id !== undefined && data.studyProgram.id !== null) {
      this.studentForm.get('studyProgram').patchValue(data.studyProgram.id);
    } else {
      this.studentForm.controls.studyProgram.setValue(data.studyProgram);
    }
    if (data.studyProgram.name !== undefined && data.studyProgram.name !== null && data.studyProgram.name != '') {
      this.studentForm.controls.studyProgramText.setValue(data.studyProgram.name);
    } else {
      this.studentForm.controls.studyProgramText.setValue(data.studyProgramText);
    }
    this.studentForm.controls.currentStudyYear.setValue(data.currentStudyYear);
    this.studentForm.controls.financialStatus.setValue(data.financialStatus);
  }

  resetForm() {
    this.studentForm.controls.id.setValue(0);
    this.studentForm.controls.firstName.setValue('');
    this.studentForm.controls.lastName.setValue('');
    this.studentForm.controls.personalIdNumber.setValue('');
    this.studentForm.controls.username.setValue('');
    this.studentForm.controls.phoneNumber.setValue('');
    this.studentForm.controls.schoolIdNumber.setValue('');
    this.studentForm.controls.email.setValue('');
    this.studentForm.controls.studyProgram.setValue('');
    this.studentForm.controls.currentStudyYear.setValue('');
    this.studentForm.controls.financialStatus.setValue('');
    if (this.activeTab !== 2) {
      this.changTab(2);
    }
    this.removeStudentStorage();
  }

  checkFormDirty(id) {
    if (this.dirty === true) {
      this.open(id);
    } else if (id > 0) {
      this.changTab(2);
      this.getStudent(id);
    } else {
      this.resetForm();
    }
  }

  deleteStudent(id: any) {
    this.studentService.deleteStudent(id).subscribe(
      resp => {
        this.getStudentList();
        this.toastr.showSuccess('Successfully deleted!');
      }
    );
  }

  getStudentStorage() {
    const form = JSON.parse(sessionStorage.getItem('studentForm'));
    this.dirty = JSON.parse(sessionStorage.getItem('studentFormDirty'));
    if (this.dirty === null || this.dirty === undefined ) {
      this.dirty = false;
    }
    if (form !== null && form !== undefined) {
      this.setFormValue(form);
    }
  }

  removeStudentStorage() {
    sessionStorage.removeItem('studentForm');
    sessionStorage.removeItem('studentFormDirty');
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
        this.onStudentSelect(id);
      }
    });
  }

}
