import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable  } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private readonly studentPath = `${environment.apiBaseUri}/students/`;
  private readonly studentsPath = `${environment.apiBaseUri}/students`;
  private readonly studentsGradesPath = `${environment.apiBaseUri}/students`;

  constructor(
    private http: HttpClient,
  ) { }

  getStudent( id: any): Observable<any> {
    return this.http.get<any>(this.studentPath + id);
  }

  getStudentGrades( id: any): Observable<any> {
    return this.http.get<any>(this.studentPath + id + '/grades');
  }

  getStudents(): Observable<any> {
    return this.http.get<any>(this.studentsPath);
  }

  saveStudent(
      email: any, firstName: any, id: any, lastName: any, personalIdNumber: any, phoneNumber: any,
      studyProgram: any, username: any, currentStudyYear: any, financialStatus: any
    )
  : Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (id === 0) {
      return this.http.post(
        this.studentsPath,
        JSON.stringify({
          email, firstName, lastName, personalIdNumber, phoneNumber, studyProgram, username, currentStudyYear, financialStatus
        })
        , { headers }
      );
    } else {
      return this.http.post(
        this.studentsPath,
        JSON.stringify({
          email, firstName, id, lastName, personalIdNumber, phoneNumber, studyProgram, username, currentStudyYear, financialStatus
        })
        , { headers }
      );
    }
  }

  deleteStudent( id: any): Observable<any> {
    return this.http.delete<any>(this.studentPath + id);
  }

}
