import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbCalendar, NgbDate, NgbDateParserFormatter, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/services/notification-service/notification-service';
import { TermService } from 'src/app/services/term/term.service';
import { ModelDialogComponent } from '../model-dialog/model-dialog.component';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  // styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit, OnDestroy {

  searchText;
  activeTab = 1;
  termsList; any;
  currentUser: any;
  adminRole = false;
  public termForm: FormGroup;
  private subscription: Subscription;
  dirty = false;
  coursesList: any;
  teachersList: any;

  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate;
  toDate: NgbDate | null = null;

  constructor(
    private termService: TermService,
    private modalService: NgbModal,
    private toastr: NotificationService,
    private calendar: NgbCalendar,
    private parserFormatter: NgbDateParserFormatter
    ) {
      this.fromDate = calendar.getToday();
      this.toDate = calendar.getNext(calendar.getToday(), 'd', 10);
    }

  ngOnInit() {
    this.createForm();

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser.roles == 'ROLE_ADMIN') {
      this.adminRole = true;
      this.getTerms();
      this.getTermStorage();
    }


    this.subscription = this.termForm.valueChanges.subscribe(x => {
      this.dirty = true;
      sessionStorage.setItem('termForm', JSON.stringify(this.prepareData()));
      sessionStorage.setItem('termFormDirty', JSON.stringify(this.dirty));
    });
  }

  createForm() {
    this.termForm =  new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),
      from: new FormControl(''),
      to: new FormControl('')
   });
  }

  onTermSelect(id: any) {
    this.checkFormDirty(id);
  }

  changTab(activeTab: any) {
    this.activeTab = activeTab;
  }

  getTerm(id: any) {
    this.termService.getTerm(id).subscribe(
      resp => {
        this.setFormValue(resp);
        this.dirty = false;
        sessionStorage.setItem('termFormDirty', JSON.stringify(this.dirty));
      }
    );
  }

  getTerms() {
    this.termService.getTerms().subscribe((resp) => {
        this.termsList = resp.content;
      }
    );
  }

  saveTerm() {
    if (this.termForm.valid) {
      const data = this.prepareData();
      if (data.from === undefined && data.from === null && data.to === undefined && data.to === null) {
        this.toastr.showSuccess('Dates required!');
      } else {
        data.from = this.parserFormatter.format(data.from);
        data.to = this.parserFormatter.format(data.to);
        this.termService.saveTerm(data.id, data.name, data.from, data.to).subscribe(
          resp => {
            this.setFormValue(resp);
            if (this.currentUser.roles != 'ROLE_STUDENT') {
              this.toastr.showSuccess('Successfully saved!');
              this.getTerms();
            }
            this.dirty = false;
            sessionStorage.setItem('termFormDirty', JSON.stringify(this.dirty));
          }
        );
      }
    } else {
      this.getFormValidationErrors();
    }
  }

  getFormValidationErrors() {
    Object.keys(this.termForm.controls).forEach(key => {
    const controlErrors: ValidationErrors = this.termForm.get(key).errors;
    if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          this.toastr.showError(key + ' ' + keyError);
        });
      }
    });
  }

  prepareData() {
    const data = this.termForm.value;
    return data;
  }

  setFormValue(data: any) {
    this.termForm.controls.id.setValue(data.id);
    this.termForm.controls.name.setValue(data.name);
    this.fromDate = this.changeDataFormat(data.from);
    this.toDate = this.changeDataFormat(data.to);
    this.termForm.controls.from.setValue(this.fromDate);
    this.termForm.controls.to.setValue(this.toDate);
  }

  resetForm() {
    this.termForm.controls.id.setValue(0);
    this.termForm.controls.name.setValue('');
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 10);
    this.termForm.controls.from.setValue(this.fromDate);
    this.termForm.controls.to.setValue(this.toDate);
    if (this.activeTab !== 2) {
      this.changTab(2);
    }
    this.removeTermStorage();
  }

  checkFormDirty(id) {
    if (this.dirty === true) {
      this.open(id);
    } else if (id > 0) {
      this.changTab(2);
      this.getTerm(id);
    } else {
      this.resetForm();
    }
  }

  deleteTerm(id: any) {
    this.termService.deleteTerm(id).subscribe(
      resp => {
        this.toastr.showSuccess('Uspešno obrisano!');
        this.getTerms();
      }
    );
  }

  getTermStorage() {
    const form = JSON.parse(sessionStorage.getItem('termForm'));
    this.dirty = JSON.parse(sessionStorage.getItem('termFormDirty'));
    if (this.dirty === null || this.dirty === undefined ) {
      this.dirty = false;
    }
    if (form !== null && form !== undefined) {
      this.setFormValue(form);
    }
  }

  removeTermStorage() {
    sessionStorage.removeItem('termForm');
    sessionStorage.removeItem('termFormDirty');
    this.dirty = false;
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
      this.termForm.controls.to.setValue(this.toDate);
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.termForm.controls.from.setValue(this.fromDate);
      this.termForm.controls.to.setValue(this.toDate);
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
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

  open(id) {
    const ngbModalOptions: NgbModalOptions = {
      backdrop : 'static',
      keyboard : false
    };
    const modalRef = this.modalService.open(ModelDialogComponent, ngbModalOptions);
    modalRef.result.then((userResponse) => {
      if (userResponse === true) {
        this.dirty = false;
        this.onTermSelect(id);
      }
    });
  }

}
