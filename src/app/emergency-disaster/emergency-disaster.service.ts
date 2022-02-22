import { EmergencyDisaster } from '../models/emergencyDisaster';
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../services/data.service';

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

}
