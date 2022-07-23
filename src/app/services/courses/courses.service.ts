import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private readonly coursesPath = `${environment.apiBaseUri}/courses/`;
  private readonly coursePath = `${environment.apiBaseUri}/courses`;
  private readonly teacherCoursePath = `${environment.apiBaseUri}/teachers/`;


  constructor(
    private http: HttpClient,
  ) { }

  getCourse( id: any): Observable<any> {
    return this.http.get<any>(this.coursesPath + id);
  }

  getCourses(): Observable<any> {
    return this.http.get<any>(this.coursePath);
  }

  getTeacherCourses(id): Observable<any> {
    return this.http.get<any>(this.teacherCoursePath + id + '/courses');
  }

  saveCourse(espbPoints: any, id: any, name: any, semester: any, year: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      this.coursePath,
      JSON.stringify({ espbPoints, id, name, semester, year})
      , { headers }
    );
  }

  deleteCourse( id: any): Observable<any> {
    return this.http.delete<any>(this.coursesPath + id);
  }

}
