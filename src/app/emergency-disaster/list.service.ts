import { EventEmitter, Injectable, Output } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { matches } from 'lodash';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { delay, switchMap } from 'rxjs/operators';
import { SortColumn } from '../directives/sorteable.directive';
import { EmergencyDisaster } from '../models/emergencyDisaster';



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
export class ListService {


  @Output() TypesEvent: EventEmitter<number> = new EventEmitter();
  @Output() TypesEventBoolean: EventEmitter<boolean> = new EventEmitter(true);


  private selectTypes$: BehaviorSubject<number> = new BehaviorSubject<number>(8); 

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
  
  constructor() { 
    this._search$.pipe(
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



  private filterTypes(): Observable<Result>{

    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

    const emergency = this.emergencyDisaster.filter(data => data.typesEmergenciesDisasters['typeEmergencyDisasterID'] == this.selectTypes$.value);
  

    let _emergencyDisaster = emergency;

    _emergencyDisaster = _emergencyDisaster.filter(employee => matches(employee));

    _emergencyDisaster = _emergencyDisaster.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);

    console.log('datos filtrados => ',  this.emergencyDisaster);

    return of({_emergencyDisaster});
  }


  status(EmergencyDisasterClone: any){


    if(this.statusBoolean){
      this.emergencyDisaster = EmergencyDisasterClone.filter(data => data.emergencyDisasterEndDate !== null)
    }else if(!this.statusBoolean){

      this.emergencyDisaster = EmergencyDisasterClone.filter(data => data.emergencyDisasterEndDate === null)
    }


    console.log('datos filtrados boolean => ',  this.emergencyDisaster);


    return  this.emergencyDisaster;

  }

}
function sort(emergency: EmergencyDisaster[], sortColumn: string, sortDirection: string) {
  throw new Error('Function not implemented.');
}

