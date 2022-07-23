import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  private readonly documentsPath = `${environment.apiBaseUri}/documents`;
  private readonly documentPath = `${environment.apiBaseUri}/documents/`;
  private readonly reportsPath = `${environment.apiBaseUri}/students/`;


  constructor(
    private http: HttpClient,
  ) { }

  public getReports(id: any): any {
    const myUrl = this.reportsPath + id + '/report';
    const mediaType = 'application/pdf';
    this.http.get(myUrl, { responseType: 'blob' }).subscribe(
        (response) => {
            const blob = new Blob([response], { type: mediaType });
            saveAs(blob, 'Report.pdf');
        },
        e => { throwError(e); }
    );
  }

  getDocuments(): Observable<any> {
    return this.http.get<any>(this.documentsPath);
  }

  public getDocument(name: any): any {
    const myUrl = this.documentPath + name;
    const mediaType = 'application/pdf';
    this.http.get(myUrl, { responseType: 'blob' }).subscribe(
        (response) => {
            const blob = new Blob([response], { type: mediaType });
            saveAs(blob, name);
        },
        e => { throwError(e); }
    );
  }

}
