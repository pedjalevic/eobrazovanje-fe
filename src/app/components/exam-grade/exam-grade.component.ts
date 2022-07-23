import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExamGradeFeil, ExamGradePass, ExamRegistrationStatus, GradeType } from 'src/app/models/exam-grade';
import { ExamGradeService } from 'src/app/services/exam-grade/exam-grade.service';
import { NotificationService } from 'src/app/services/notification-service/notification-service';
import { TeacherService } from 'src/app/services/teacher/teacher.service';

@Component({
  selector: 'app-exam-grade',
  templateUrl: './exam-grade.component.html',
  // styleUrls: ['./exam-grade.component.css']
})
export class ExamGradeComponent implements OnInit {

  searchText;
  activeTab = 1;
  examGradeFeil: ExamGradeFeil;
  examGradePass: ExamGradePass;
  gradeType = GradeType;
  examGradeList: any;
  currentUser: any;
  dirty = false;
  teacherRole = false;
  selectedTeacher;
  teachersList: any;

  selectedGrade: any;


  constructor(
    private examGradeService: ExamGradeService,
    private teacherService: TeacherService,
    private toastr: NotificationService,
    private router: Router
    ) {
    }

  ngOnInit() {

    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (this.currentUser.roles == 'ROLE_TEACHER') {
      this.teacherRole = true;
      this.getExamsGrade(this.currentUser.id);
    } else if (this.currentUser.roles == 'ROLE_ADMIN') {
      this.getTeacherList();
    } else {
      this.router.navigate(['']);
    }


  }

  changTab(activeTab: any) {
    this.activeTab = activeTab;
  }

  getExamsGrade(id) {
    this.examGradeService.getExamsGrade(id).subscribe((resp) => {
        this.examGradeList = resp.content;
      }
    );
  }

  getTeacherList() {
    this.teacherService.getTeachers().subscribe((resp) => {
        this.teachersList = resp.content;
      }
    );
  }

  teacherSelect(ev: any) {
    this.getExamsGrade(ev);
  }

  checkSaveStatus(grade: any) {
    if (this.selectedGrade !== undefined && this.selectedGrade !== null) {
      if (this.selectedGrade === this.gradeType.FIVE) {
        this.saveExamFail(grade);
      } else {
        this.saveExamPass(grade);
      }
    } else {
      this.toastr.showError('Select grade!');
    }
  }

  saveExamPass(gradePass: any) {
    const examRegistration = { 'id': gradePass.id};
    const exam = { 'id': gradePass.exam.id};
    const student = { 'id': gradePass.student.id};
    this.examGradeService.saveExamPass(exam, student, examRegistration, this.selectedGrade).subscribe(
      resp => {
        this.toastr.showSuccess('Successfully saved!');
        if (this.teacherRole) {
          this.getExamsGrade(this.currentUser.id);
        } else {
          this.getExamsGrade(this.selectedTeacher);
        }
        this.selectedGrade = undefined;
        this.dirty = false;
        sessionStorage.setItem('termFormDirty', JSON.stringify(this.dirty));
      }
    );
  }

  saveExamFail(gradeFail: any) {
    const exam = { 'id': gradeFail.exam.id};
    const student = { 'id': gradeFail.student.id};
    this.examGradeService.saveExamFail(gradeFail.id, exam, student, ExamRegistrationStatus.FAILED).subscribe(
      resp => {
        this.toastr.showSuccess('Successfully saved!');
        if (this.teacherRole) {
          this.getExamsGrade(this.currentUser.id);
        } else {
          this.getExamsGrade(this.selectedTeacher);
        }
        this.selectedGrade = undefined;
        this.dirty = false;
        sessionStorage.setItem('termFormDirty', JSON.stringify(this.dirty));
      }
    );
  }

}
