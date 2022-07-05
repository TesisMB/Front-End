import { Files } from './../models/monitoreos';
import { DataService } from './../services/data.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoService extends DataService {
path = 'pdf';
private filesSubject: BehaviorSubject<Files[]> = new BehaviorSubject<Files[]>(null);
public files$: Observable<Files[]> = new Observable<Files[]>(null);
constructor(http: HttpClient) {
    super(http, 'pdf');
    this.files$ = this.filesSubject.asObservable();
   }

 public get files(){return this.filesSubject.asObservable()}

   public setMonitoreo(pdf: Files){
    let pdfs = this.filesSubject.value;
    pdfs.push(pdf);
    this.filesSubject.next(pdfs);
   }
   upload(file: File ){
    const PDF: FormData = new FormData();
    PDF.append('file', file);
    const req = new HttpRequest('POST', `${environment.URL}upload/pdf`, PDF, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  
  getFiles(fileName: string): Observable<any> {
    const headers = new HttpHeaders().set('Accept','application/pdf');
    const paramsObj = {
      fileName: fileName || undefined,
    };
    let parametro = new HttpParams({fromObject: paramsObj});
    // this.options.params = parametro;
    // this.options.headers = headers;
  
    
     return this.http.get(`${environment.URL + this.path}/download`,{
      headers: headers,
      params: parametro,
      responseType: 'blob'
    });
  }

}
