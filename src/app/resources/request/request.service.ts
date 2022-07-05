import { Parametros } from './../../models/Parametros';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services';

@Injectable({
  providedIn: 'root'
})
export class RequestService extends DataService {

  constructor(http: HttpClient) { 
    super(http, 'ResourcesRequest')
  }

  getAll(condition?:string, state?: string): Observable<any> {
    if(condition){
      
      const paramsObj = {
        // userId: JSON.stringify(userId) || undefined,
        Condition: condition || undefined,
        state: state ||undefined
      };
      
      let parametro = new HttpParams({fromObject: paramsObj});

      
      this.options.params = parametro;
      return this.http.get<any>(environment.URL + this.patch, this.options);
    }
    else {
      // const parametro = new HttpParams().append('userId', JSON.stringify(userId));
      // this.options.params = parametro;
      return this.http.get<any>(environment.URL + this.patch);
    }
  }

  rejectRequest(response){
  return  this.http.post<any>(environment.URL +  this.patch+'/acceptRejectRequest' , response);
  }

  delete(id) {
    return this.http.delete(environment.URL + this.patch + '/' + id);
  }

  generatePDFRequest(startDate: String, tipo: String): Observable<any> {
    // let paramaters = new HttpParams().append('startDate', JSON.stringify(startDate));
    // this.options.params = paramaters;


     let url = environment.URL  + this.patch + '/pdf/?Condition=' + tipo + '&dateStart=' + startDate;
   
    const headers = new HttpHeaders().set('Accept','application/pdf');
    return this.http.get(url, 
        {
          headers: headers,
          responseType: 'blob'
        }
      );
    }

}
