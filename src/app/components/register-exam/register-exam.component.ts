import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamRegistrationService } from 'src/app/services/exam-registration/exam-registration.service';
import { NotificationService } from 'src/app/services/notification-service/notification-service';
import { StudentService } from 'src/app/services/student/student.service';

@Component({
  selector: 'app-register-exam',
  templateUrl: './register-exam.component.html',
  // styleUrls: ['./register-exam.component.css']
})
export class RegisterExamComponent implements OnInit {

  searchText;
  activeTab = 1;
  examRegistrationList: any;
  currentUser: any;
  studentRole = false;
  dirty = false;
  studentsList: any;
  selectedStudent: any;


  constructor(
    private examRegistrationService: ExamRegistrationService,
    private toastr: NotificationService,
    private router: Router,
    private studentService: StudentService
    ) {
    }

  ngOnInit() {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser.roles == 'ROLE_STUDENT') {
      this.studentRole = true;
      this.getExamRegistrations(this.currentUser.id);
    } else if (this.currentUser.roles == 'ROLE_ADMIN') {
      this.getStudentList();
    } else {
      this.router.navigate(['']);
    }

  }

  changTab(activeTab: any) {
    this.activeTab = activeTab;
  }

  getExamRegistrations(id: any) {
    this.examRegistrationService.getExamRegistable(id).subscribe((resp) => {
        this.examRegistrationList = resp.content;
      }
    );
  }

  getStudentList() {
    this.studentService.getStudents().subscribe((resp) => {
        this.studentsList = resp.content;
      }
    );
  }

  studentSelect(ev: any) {
    this.getExamRegistrations(ev);
  }

  saveExamRegistration(id: any) {
    const exam = { 'id': id};
    let student;
    if (this.studentRole) {
      student = { 'id': Number(this.currentUser.id)};
    } else {
      student = { 'id': Number(this.selectedStudent)};
    }
    this.examRegistrationService.saveExamRegistration(exam, student).subscribe(
      resp => {
        this.toastr.showSuccess('Successfully registered!');
        if (this.studentRole) {
          this.getExamRegistrations(this.currentUser.id);
        } else {
          this.getExamRegistrations(this.selectedStudent);
        }
        this.dirty = false;
        sessionStorage.setItem('termFormDirty', JSON.stringify(this.dirty));
      }
    );
  }

}
