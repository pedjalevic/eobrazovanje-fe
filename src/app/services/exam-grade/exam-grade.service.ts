import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamGradeService {

  private readonly examGradePath = `${environment.apiBaseUri}/teachers/`;
  private readonly examsGradeFailPath = `${environment.apiBaseUri}/exam-registrations`;
  private readonly examsgradePassPath = `${environment.apiBaseUri}/grades`;

  constructor(
    private http: HttpClient,
  ) { }

  getExamsGrade(id: any): Observable<any> {
    return this.http.get<any>(this.examGradePath + id + '/exam-registrations');
  }

  saveExamFail(id: any, exam: any, student: any, examRegistrationStatus: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      this.examsGradeFailPath,
      JSON.stringify({ id, exam, student, examRegistrationStatus })
      , { headers }
    );
  }

  saveExamPass(exam: any, student: any, examRegistration: any, gradeType: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      this.examsgradePassPath,
      JSON.stringify({ exam, student, examRegistration, gradeType })
      , { headers }
    );
  }

}

