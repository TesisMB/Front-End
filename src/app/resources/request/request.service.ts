import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from 'src/app/services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequestService extends DataService {

  constructor(http: HttpClient) { 
    super(http, 'ResourcesRequest')
  }

  getAll(condition?:string): Observable<any> {
    if(condition){
      let parametros = new HttpParams().append('Condition', condition);
      this.options.params = parametros;
      return this.http.get<any>(environment.URL + this.patch, this.options);
    }
    else {
      return this.http.get<any>(environment.URL + this.patch);
    }
  }

}
