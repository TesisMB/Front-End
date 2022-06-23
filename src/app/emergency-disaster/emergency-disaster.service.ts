import { filter, map } from 'rxjs/operators';
import { EmergencyDisaster } from '../models/emergencyDisaster';
import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { DataService } from '../services/data.service';
import { environment } from 'src/environments/environment';
import { Operation } from 'fast-json-patch';
import { AlertDegree, Alerts } from '../models/alerts';
import { Alert } from '../models';

@Injectable({
  providedIn: 'root'
})


export class EmergencyDisasterService extends DataService {

  private _EmergencyDisasterSubject: BehaviorSubject<EmergencyDisaster> = new BehaviorSubject<EmergencyDisaster>(null);

  
/*   private _EmergencyDisaster: BehaviorSubject<number> = new BehaviorSubject<number>(4);
 */  handler: any;
  constructor(http: HttpClient) {
    super(http, 'EmergenciesDisasters');
  }

  
  public get ListarAlertas(): Alerts[]{
    
    const array = Object.values(AlertDegree);

    let alerts: Alerts[] ;
    
    alerts = array.map((alert,i) => {  return new Alerts(i+1, alert, alert);});

    return alerts;
  }



  deleteEmergencyDisaster(id: number){
    return this.http
    .delete(environment.apiUrl + this.patch + '/' + id);
  }

  get EmergencyDisasterValue(){
    //es el valor del observable lo filtro por indice
    return this._EmergencyDisasterSubject.value;
  }

  get EmergencyDisasterSubject$(){
    return this._EmergencyDisasterSubject.asObservable();
  }

   SetEmergencyDisaster(emergencyDisaster: EmergencyDisaster){
     console.log('Service - Next=> ',emergencyDisaster);
    this._EmergencyDisasterSubject.next(emergencyDisaster);
  }


  getAllWithoutFilter(userId: number, params?: string): Observable<any> {
    const paramsObj = {
      userId: JSON.stringify(userId) || undefined,
      limit: params || undefined
    };
    let parametro = new HttpParams({fromObject: paramsObj});
    this.options.params = parametro;

    return this.http.get<any>(environment.apiUrl + this.patch+'/WithoutFilter', this.options);

    // .pipe(map(x => { 
    //   const items = x.filter(f => f.alerts.alertDegree != 'Controlado');
    //    return items;
    // }));


}

getByIdWithoutFilter(id: number): Observable<any> {
  return this.http.get<any>(environment.apiUrl + this.patch+'/WithoutFilter/' + id);
}

  patchEmergencyDisaster(emergencyDisaster: EmergencyDisaster, operations: Operation[],): Observable<any> {
    return this.http.patch<any>(environment.apiUrl + this.patch+ '/' + emergencyDisaster.emergencyDisasterID, operations);

}


}
