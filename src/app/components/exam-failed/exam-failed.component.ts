import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamRegistrationService } from 'src/app/services/exam-registration/exam-registration.service';
import { NotificationService } from 'src/app/services/notification-service/notification-service';
import { StudentService } from 'src/app/services/student/student.service';

@Component({
  selector: 'app-exam-failed',
  templateUrl: './exam-failed.component.html',
  // styleUrls: ['./exam-failed.component.css']
})
export class ExamFailedComponent implements OnInit {


  searchText;
  activeTab = 1;
  examFailedList: any;
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
    this.examRegistrationService.getExamRegistrations(id).subscribe((resp) => {
      const failedExams = [];
      const passedExams = [];
      for (const item in resp.content ) {
        if (item !== undefined) {
          if (resp.content[item].examRegistrationStatus == 'FAILED') {
            failedExams.push(resp.content[item]);
          } else if (resp.content[item].examRegistrationStatus == 'PASSED') {
            passedExams.push(resp.content[item]);
          }
        }
      }
      this.examFailedList = failedExams;
      for (const fail in failedExams) {
        if (fail !== undefined) {
          for (const pass in passedExams) {
            if (pass !== undefined) {
              if (failedExams[fail].exam.course.id === passedExams[pass].exam.course.id) {
                this.removePassedExams(failedExams[fail]);
              }
            }
          }
        }
      }
    });
  }

  removePassedExams(data: any) {
    const notPassExams = [];
    for (const prop in this.examFailedList) {
      if (prop !== undefined) {
        if (this.examFailedList[prop].exam.course.id !== data.exam.course.id) {
          notPassExams.push(this.examFailedList[prop]);
        }
      }
    }
    this.examFailedList = notPassExams;
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

}
