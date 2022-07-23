import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudyProgramService {

  private readonly studyProgramPath = `${environment.apiBaseUri}/study-programs/`;
  private readonly studyProgramsPath = `${environment.apiBaseUri}/study-programs`;


  constructor(
    private http: HttpClient,
  ) { }

  getStudyProgram( id: any): Observable<any> {
    return this.http.get<any>(this.studyProgramPath + id);
  }

  getStudyPrograms(): Observable<any> {
    return this.http.get<any>(this.studyProgramsPath);
  }

  saveStudyProgram(
      id: any, name: any, prefix: any, studyField: any, espbPoints: any, studyProgramType: any, courses: any
    ): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (id === 0) {
      return this.http.post(
        this.studyProgramsPath,
        JSON.stringify({ name, prefix, studyField, espbPoints, studyProgramType, courses })
        , { headers }
      );
    } else {
      return this.http.post(
        this.studyProgramsPath,
        JSON.stringify({ id, name, prefix, studyField, espbPoints, studyProgramType, courses })
        , { headers }
      );
    }
  }

  deleteStudyProgram( id: any): Observable<any> {
    return this.http.delete<any>(this.studyProgramPath + id);
  }

}
