import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EngagementsService {

  private readonly engagementsPath = `${environment.apiBaseUri}/engagements/`;
  private readonly engagementPath = `${environment.apiBaseUri}/engagements`;


  constructor(
    private http: HttpClient,
  ) { }

  getEngagement( id: any): Observable<any> {
    return this.http.get<any>(this.engagementsPath + id);
  }

  getEngagements(): Observable<any> {
    return this.http.get<any>(this.engagementPath);
  }

  saveEngagement(id: any, engagementType: any, course: any, teacher: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (id === 0) {
      return this.http.post(
        this.engagementPath,
        JSON.stringify({ engagementType, course, teacher })
        , { headers }
      );
    } else {
      return this.http.post(
        this.engagementPath,
        JSON.stringify({ id, engagementType, course, teacher })
        , { headers }
      );
    }
  }

  deleteEngagement( id: any): Observable<any> {
    return this.http.delete<any>(this.engagementsPath + id);
  }

}
