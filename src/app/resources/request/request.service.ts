import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/services';
import { User } from 'src/app/models';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RequestService extends DataService {
private _condition$ = new BehaviorSubject<string>('');
private _typesAlert$ = new BehaviorSubject<any[]>([]);
private currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
  constructor(http: HttpClient) { 
    super(http, 'ResourcesRequest')
  }

  get condition$() {
    return this._condition$.asObservable();
  }
  get typesAlert$() {
    return this._typesAlert$.asObservable();
  }
  set condition(condition: string){
    this._condition$.next(condition);
  }
  set typesAlert(types: any[]){
    this._typesAlert$.next(types);
  }

  getAll(condition?:string, state?: string): Observable<any> {
    let arrOfTypes = [];
    let arrOfSolicitantes = [];
    if(condition){
      // this.condition = condition;
      const paramsObj = {
        // userId: JSON.stringify(userId) || undefined,
        Condition: condition || undefined,
        state: state || this.currentUser.estates.locationID.toString()
      };
      
      let parametro = new HttpParams({fromObject: paramsObj});

      
      this.options.params = parametro;
      return this.http.get<any>(environment.URL + this.patch, this.options)
      .pipe(map(
        data => {
          data.forEach(item =>{
            // const types = {id: item.typeEmergencyDisasterID,name: item.typeEmergencyDisasterName};
            const solicitantes = {id: item.createdBy, name: item.createdByEmployee}
            arrOfTypes.push(item.typeEmergencyDisasterName.toLowerCase());
            arrOfSolicitantes.push(solicitantes);
          });
          // arrOfTypes.push({
          //   id: 8,
          //   name: "Todos"
          // });
          arrOfSolicitantes.push({
            id: -1,
            name: "Todos"
          });
          
          this.typesAlert = this.removeDuplicates(arrOfTypes);
          // this.typesAlert = arrOfTypes;
            return data;
        }
      ));
    }
    else {
      // const parametro = new HttpParams().append('userId', JSON.stringify(userId));
      // this.options.params = parametro;
      return this.http.get<any>(environment.URL + this.patch);
    }
  }
  removeDuplicates(arr) {
    return [...new Set(arr)];
}
  rejectRequest(response){
  return  this.http.post<any>(environment.URL +  this.patch+'/acceptRejectRequest' , response);
  }

  delete(id) {
    return this.http.delete(environment.URL + this.patch + '/' + id);
  }

  generatePDFRequest(startDate: string, tipo: string, endDate: string, userId: number, emergencyId: number): Observable<any> {
    // let paramaters = new HttpParams().append('startDate', JSON.stringify(startDate));
    // this.options.params = paramaters;

//https://localhost:5001/api/resourcesRequest/pdf/?userId=2
//&Condition=Rechazada&dateStart=Mon May 10 2021 00:00:00 GMT-0300 (hora estándar de Argentina)
//)&dateEnd=Thu Jul 07 2022 00:00:00 GMT-0300 (hora estándar de 

     let url = environment.URL  + this.patch + '/pdf/?Condition=' + tipo + '&dateStart=' + startDate;
    
     if(userId !=null && endDate == null && emergencyId == null)
    {
      url = environment.URL  + this.patch + '/pdf/?Condition=' + tipo + '&dateStart=' + startDate + '&emergency=' + emergencyId
      + '&id=' + userId;
      
    }else if (userId == null && emergencyId != null && endDate == null)
    {
      url = environment.URL  + this.patch + '/pdf/?Condition=' + tipo + '&dateStart=' + startDate + '&emergency=' + emergencyId;
    }

    else if(userId != null && emergencyId != null && endDate ==  null)
    {

      url = environment.URL  + this.patch + '/pdf/?Condition=' + tipo + '&dateStart=' + startDate + 
      '&id=' + userId + '&emergency=' + emergencyId;
    }
    
      else if (userId != null && emergencyId == null && endDate != null)
      {
          url = environment.URL  + this.patch + '/pdf/?Condition=' + tipo + '&dateStart=' + startDate + 
          '&dateEnd=' + endDate + '&id=' + userId;

      }
      else if (userId == null && emergencyId != null && endDate != null)
      {
        url = environment.URL  + this.patch + '/pdf/?Condition=' + tipo + '&dateStart=' + startDate + 
        '&dateEnd=' + endDate  + '&emergency=' + emergencyId;
      }
      else
      {
        url = environment.URL  + this.patch + '/pdf/?Condition=' + tipo + '&dateStart=' + startDate + 
        '&dateEnd=' + endDate + '&id=' + userId + '&emergency=' + emergencyId;
      }

    const headers = new HttpHeaders().set('Accept','application/pdf');
    return this.http.get(url, 
        {
          headers: headers,
          responseType: 'blob'
        }
      );
    }

}
