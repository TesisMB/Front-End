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

  getAll(userId: number, condition?:string): Observable<any> {
    if(condition){
      //parametro = new HttpParams().append('userId', JSON.stringify(userId));
      
      const paramsObj = {
        Condition: condition || undefined,
        UserId: JSON.stringify(userId) || undefined
      };
      
      let parametro = new HttpParams({fromObject: paramsObj});

      
      this.options.params = parametro;
      return this.http.get<any>(environment.URL + this.patch, this.options);
    }
    else {
      return this.http.get<any>(environment.URL + this.patch);
    }
  }

  rejectRequest(response){
  return  this.http.post<any>(environment.URL +  this.patch+'/acceptRejectRequest' , response);
  }

  delete(id) {
    return this.http.delete(environment.URL + this.patch + '/' + id);
  }

}
