import { switchMap, delay, debounceTime } from 'rxjs/operators';
import { EmergencyDisaster } from './../models/emergencyDisaster';
import { TypesEmergencyDisaster } from './../models/typeEmergencyDisaster';
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { DataService } from 'src/app/services';
import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter } from '@angular/core';
import { matches } from 'lodash';
import { SortDirection } from '@angular/material/sort';
import { SortColumn } from '../directives/sorteable.directive';
import { DecimalPipe } from '@angular/common';


interface Result{
  _emergencyDisaster: EmergencyDisaster[];
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}
@Injectable({
  providedIn: 'root'
})
export class SelectTypesEmergencyDisasterService extends DataService{


  @Output() TypesEvent: EventEmitter<number> = new EventEmitter();
  @Output() TypesEventBoolean: EventEmitter<boolean> = new EventEmitter(true);


  private selectTypes$: BehaviorSubject<number> = new BehaviorSubject<number>(2); 

  private emergencyDisaster$: BehaviorSubject<EmergencyDisaster[]> = new BehaviorSubject<EmergencyDisaster[]>(null); 
  
  private status$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true); 
  
  private _search$ = new Subject<void>();


  emergencyDisaster: EmergencyDisaster [];
  id: number;
  EmergenciesDisastersClone: EmergencyDisaster [];
  
  statusBoolean: boolean = true;
  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };
  
  constructor(http: HttpClient, private pipe: DecimalPipe) { 
    super(http, 'typesEmergenciesDisasters');

    this._search$.pipe(
      debounceTime(200),
      switchMap(()=> this.filterTypes()),
      delay(200)
    ).subscribe(result => {
      this.emergencyDisaster$.next(result._emergencyDisaster)
    });

    this._search$.next();
  }


  get selectTypesEmergencyDisaster$(){
    return this.selectTypes$.asObservable();
  }


  setTypes(id: number){
    this.id = id;
    this.selectTypes$.next(id);
    console.log("SERVICIO ID", this.id);
  }


  get statusTypesEmergencyDisaster$(){
    return this.status$.asObservable();
  }


  setStatus(event){
    console.log("Evento => ", event)
    this.statusBoolean = event;
    this.status$.next(event);
  }



  get  emergencyDisasterObservable$ (){
    return this.emergencyDisaster$.asObservable();
  }


  setEmergencyDisaster (emrgencyDisaster: EmergencyDisaster[]){
    this.emergencyDisaster$.next(emrgencyDisaster);
  }
  

  updateEmergencyDisaster(emergency: EmergencyDisaster[]){
    this.emergencyDisaster = emergency;
    console.log("SERVICIO", this.emergencyDisaster);
  }


  public uploadTable(EmergencyDisaster: EmergencyDisaster[]) {
    this.emergencyDisaster = EmergencyDisaster;
    this.emergencyDisaster$.next(EmergencyDisaster);
    this._search$.next();
  }


  private filterTypes(): Observable<Result>{

    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    const emergency = this.emergencyDisaster.filter(data => data.typesEmergenciesDisasters['typeEmergencyDisasterID'] == this.selectTypes$.value);
  

    let _emergencyDisaster = emergency;

    _emergencyDisaster = _emergencyDisaster.filter(employee => matches(employee));

    _emergencyDisaster = _emergencyDisaster.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    console.log('datos filtrados => ',  emergency);

    return of({_emergencyDisaster});
  }


  status(EmergencyDisasterClone: any){


    if(this.statusBoolean){
      this.emergencyDisaster = EmergencyDisasterClone.filter(data => data.emergencyDisasterEndDate !== null)
    }else if(!this.statusBoolean){

      this.emergencyDisaster = EmergencyDisasterClone.filter(data => data.emergencyDisasterEndDate === null)
    }


    console.log('datos filtrados boolean => ', this.emergencyDisaster);


    return  this.emergencyDisaster;

  }

}
function sort(emergency: EmergencyDisaster[], sortColumn: string, sortDirection: string) {
  throw new Error('Function not implemented.');
}

