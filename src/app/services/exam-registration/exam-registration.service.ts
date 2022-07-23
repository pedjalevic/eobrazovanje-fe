import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamRegistrationService {

  private readonly examRegistablePath = `${environment.apiBaseUri}/students/`;
  private readonly examRegisterPath = `${environment.apiBaseUri}/exam-registrations`;
  private readonly examRegistrationsPath = `${environment.apiBaseUri}/students/`;

  constructor(
    private http: HttpClient,
  ) { }

  getExamRegistable(id: any): Observable<any> {
    return this.http.get<any>(this.examRegistablePath + id + '/registrable-exams');
  }

  getExamRegistrations(id: any): Observable<any> {
    return this.http.get<any>(this.examRegistrationsPath + id + '/exam-registrations');
  }

  saveExamRegistration(exam: any, student: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      this.examRegisterPath,
      JSON.stringify({ exam, student })
      , { headers }
    );
  }

}
