import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private readonly adminPath = `${environment.apiBaseUri}/users/`;
  private readonly adminsPath = `${environment.apiBaseUri}/users`;
  private readonly userPath = `${environment.apiBaseUri}/users/`;


  constructor(
    private http: HttpClient
  ) { }

  getAdmin( username: any): Observable<any> {
    return this.http.get<any>(this.userPath + username);
  }

  getAdmins(): Observable<any> {
    return this.http.get<any>(this.adminsPath);
  }

  saveAdmin(
      email: any, firstName: any, id: any, lastName: any, personalIdNumber: any, phoneNumber: any,
      username: any, role: any
    )
  : Observable<any> {
    const headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (id === 0) {
      return this.http.post(
        this.adminsPath,
        JSON.stringify({
          email, firstName, lastName, personalIdNumber, phoneNumber, username, role
        })
        , { headers }
      );
    } else {
      return this.http.post(
        this.adminsPath,
        JSON.stringify({
          email, firstName, id, lastName, personalIdNumber, phoneNumber, username, role
        })
        , { headers }
      );
    }
  }

  deleteAdmin(id: any): Observable<any> {
    return this.http.delete<any>(this.adminPath + id);
  }

}
