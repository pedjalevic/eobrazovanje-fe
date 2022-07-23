import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentComponent } from './components/student/student.component';
import { LoginComponent } from './components/login/login.component';
import { CoursesComponent } from './components/courses/courses.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { PaymentsComponent } from './components/payments/payments.component';
import { GradesComponent } from './components/grades/grades.component';
import { ExamGradeComponent } from './components/exam-grade/exam-grade.component';
import { HomeComponent } from './components/home/home.component';
import { TeacherComponent } from './components/teacher/teacher.component';
import { StudyProgramsComponent } from './components/study-programs/study-programs.component';
import { EngagementsComponent } from './components/engagements/engagements.component';
import { TermComponent } from './components/term/term.component';
import { ExamComponent } from './components/exam/exam.component';
import { RegisterExamComponent } from './components/register-exam/register-exam.component';
import { AdminComponent } from './components/admin/admin.component';
import { ExamRegistrationHistoryComponent } from './components/exam-registration-history/exam-registration-history.component';
import { ExamFailedComponent } from './components/exam-failed/exam-failed.component';

const routes: Routes = [
  { path: '', component: HomeComponent},
  { path: 'login', component: LoginComponent},
  { path: 'student', component: StudentComponent},
  { path: 'courses', component: CoursesComponent},
  { path: 'documents', component: DocumentsComponent},
  { path: 'payments', component: PaymentsComponent},
  { path: 'grades', component: GradesComponent},
  { path: 'exam-registrations', component: RegisterExamComponent},
  { path: 'exam-grade', component: ExamGradeComponent},
  { path: 'teacher', component: TeacherComponent},
  { path: 'study-programs', component: StudyProgramsComponent},
  { path: 'engagements', component: EngagementsComponent},
  { path: 'term', component: TermComponent},
  { path: 'exam', component: ExamComponent},
  { path: 'admins', component: AdminComponent},
  { path: 'exam-history', component: ExamRegistrationHistoryComponent},
  { path: 'exam-failed', component: ExamFailedComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
