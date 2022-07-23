import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamRegistrationService } from 'src/app/services/exam-registration/exam-registration.service';
import { NotificationService } from 'src/app/services/notification-service/notification-service';
import { StudentService } from 'src/app/services/student/student.service';

@Component({
  selector: 'app-grades',
  templateUrl: './grades.component.html',
  styleUrls: ['./grades.component.css']
})
export class GradesComponent implements OnInit {

  searchText;
  activeTab = 1;
  examPassedList: any;
  currentUser: any;
  studentRole = false;
  dirty = false;
  studentsList: any;
  selectedStudent: any;


  constructor(
    private router: Router,
    private studentService: StudentService
    ) {
    }

  ngOnInit() {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser.roles == 'ROLE_STUDENT') {
      this.studentRole = true;
      this.getStudentGrades(this.currentUser.id);
    } else if (this.currentUser.roles == 'ROLE_ADMIN') {
      this.getStudentList();
    } else {
      this.router.navigate(['']);
    }

  }

  changTab(activeTab: any) {
    this.activeTab = activeTab;
  }

  getStudentGrades(id: any) {
    this.studentService.getStudentGrades(id).subscribe((resp) => {
      this.examPassedList = resp.content;
    });
  }

  getStudentList() {
    this.studentService.getStudents().subscribe((resp) => {
        this.studentsList = resp.content;
      }
    );
  }

  studentSelect(ev: any) {
    this.getStudentGrades(ev);
  }

}
