import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TermService {

  private readonly termsPath = `${environment.apiBaseUri}/terms/`;
  private readonly termPath = `${environment.apiBaseUri}/terms`;


  constructor(
    private http: HttpClient,
  ) { }

  getTerm( id: any): Observable<any> {
    return this.http.get<any>(this.termsPath + id);
  }

  getTerms(): Observable<any> {
    return this.http.get<any>(this.termPath);
  }

  saveTerm(id: any, name: any, from: any, to: any): Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(
      this.termPath,
      JSON.stringify({ id, name, from, to })
      , { headers }
    );
  }

  deleteTerm( id: any): Observable<any> {
    return this.http.delete<any>(this.termsPath + id);
  }

}
