import { EmergencyDisaster } from './../models/emergencyDisaster';
import { TypesEmergencyDisaster } from './../models/typeEmergencyDisaster';
import { Observable, BehaviorSubject } from 'rxjs';
import { DataService } from 'src/app/services';
import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectTypesEmergencyDisasterService extends DataService{
  @Output() TypesEvent: EventEmitter<number> = new EventEmitter();
  @Output() TypesEventBoolean: EventEmitter<boolean> = new EventEmitter(true);

  private selectTypes$: BehaviorSubject<number> = new BehaviorSubject<number>(null); 


  private status$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); 

  EmergencyDisaster: EmergencyDisaster [];
  id: number;
  EmergenciesDisastersClone: EmergencyDisaster [];
  statusBoolean: boolean = true;
  constructor(http: HttpClient) { 
    super(http, 'typesEmergenciesDisasters');
  }


  get selectTypesEmergencyDisaster$(){
    return this.selectTypes$.asObservable();
  }


  setTypes(id: number){
    this.id = id;
    this.selectTypes$.next(id);
  }


  get statusTypesEmergencyDisaster$(){
    return this.status$.asObservable();
  }


  setStatus(event){
    console.log("Evento => ", event)
    this.statusBoolean = event;
    this.status$.next(event);
  }



  

  filterTypes(EmergencyDisasterClone: any){


    this.EmergencyDisaster = EmergencyDisasterClone.filter(data => data.typesEmergenciesDisasters['typeEmergencyDisasterID'] == this.id);
  
    console.log('datos filtrados => ',  this.EmergencyDisaster);

    return  this.EmergencyDisaster;
  }


  status(EmergencyDisasterClone: any){


    if(this.statusBoolean){
      this.EmergencyDisaster = EmergencyDisasterClone.filter(data => data.emergencyDisasterEndDate !== null)
    }else if(!this.statusBoolean){

      this.EmergencyDisaster = EmergencyDisasterClone.filter(data => data.emergencyDisasterEndDate === null)
    }


    console.log('datos filtrados boolean => ',  this.EmergencyDisaster);


    return  this.EmergencyDisaster;

  }

}
