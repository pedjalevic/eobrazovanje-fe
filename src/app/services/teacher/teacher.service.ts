import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  private readonly teacherPath = `${environment.apiBaseUri}/teachers/`;
  private readonly teachersPath = `${environment.apiBaseUri}/teachers`;

  constructor(
    private http: HttpClient
  ) { }

  getTeacher( id: any): Observable<any> {
    return this.http.get<any>(this.teacherPath + id);
  }

  getTeachers(): Observable<any> {
    return this.http.get<any>(this.teachersPath);
  }

  saveTeacher(
      academicTitle: any, email: any, firstName: any, id: any, lastName: any, personalIdNumber: any, phoneNumber: any, username: any
    )
  : Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (id === 0) {
      return this.http.post(
        this.teachersPath,
        JSON.stringify({ academicTitle, email, firstName, lastName, personalIdNumber, phoneNumber, username })
        , { headers }
      );
    } else {
      return this.http.post(
        this.teachersPath,
        JSON.stringify({ academicTitle, email, firstName, id, lastName, personalIdNumber, phoneNumber, username })
        , { headers }
      );
    }
  }

  deleteTeacher( id: any): Observable<any> {
    return this.http.delete<any>(this.teacherPath + id);
  }
}
