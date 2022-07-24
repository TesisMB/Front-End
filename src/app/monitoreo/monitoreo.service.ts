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
private filesSubject: BehaviorSubject<Files[]> = new BehaviorSubject<Files[]>(JSON.parse(localStorage.getItem('pdfs')));
//public files$: Observable<Files[]> = new Observable<Files[]>(null);
constructor(http: HttpClient) {
    super(http, 'pdf');
     this.files$ = this.filesSubject.asObservable();
   }

 public get files(){return this.filesSubject.asObservable()}
public get pdfs(){return this.filesSubject.value}

 files$ = this.http.get<Files[]>(environment.URL + this.path, this.options);

   upload(file: File ){
    const PDF: FormData = new FormData();
    PDF.append('file', file);
    const req = new HttpRequest('POST', `${environment.URL}upload/pdf`, PDF, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  deletePDF(id: number){
    const files: Files[] = this.pdfs.filter(x => x.id !== id);
    this.addPDF(files);
  }
  addPDF(pdfs: Files[]): void{
    this.filesSubject.next(pdfs);
    localStorage.setItem('pdfs',JSON.stringify(pdfs));

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
