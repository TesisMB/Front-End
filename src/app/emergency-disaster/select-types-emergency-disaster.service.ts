import { switchMap, delay, debounceTime, tap } from 'rxjs/operators';
import { EmergencyDisaster } from './../models/emergencyDisaster';
import { Observable, BehaviorSubject, of, Subject } from 'rxjs';
import { DataService } from 'src/app/services';
import { HttpClient } from '@angular/common/http';
import { Injectable, Output, EventEmitter, PipeTransform } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { SortColumn } from '../directives/sorteable.directive';
import { DecimalPipe } from '@angular/common';


interface SearchResult{
 data: any;
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

  
const compare = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(emergencyDisaster: EmergencyDisaster[], column: SortColumn, direction: string): EmergencyDisaster[] {
  if (direction === '' || column === '') {
    return emergencyDisaster;
  } else {
    return [...emergencyDisaster].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}



function matches(emergencyDisaster: EmergencyDisaster, term: string, pipe: PipeTransform) {
  return emergencyDisaster.typesEmergenciesDisasters.typeEmergencyDisasterName.includes(term)
}



@Injectable({
  providedIn: 'root'
})
export class SelectTypesEmergencyDisasterService extends DataService{


  @Output() TypesEvent: EventEmitter<number> = new EventEmitter();
  @Output() TypesEventBoolean: EventEmitter<boolean> = new EventEmitter(true);


  private _loading$ = new BehaviorSubject<boolean>(true);

  private selectTypes$: BehaviorSubject<number> = new BehaviorSubject<number>(8); 

  private emergencyDisaster$: BehaviorSubject<EmergencyDisaster[]> = new BehaviorSubject<EmergencyDisaster[]>([]); 
  
  private status$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  
  private _search$ = new Subject<void>();

  private _total$ = new BehaviorSubject<number>(0);



  emergencyDisaster: EmergencyDisaster [] = [];
  id: number;
  
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
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(()=> this.filterTypes()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this.emergencyDisaster$.next(result.data)
      this._total$.next(result.total);
    });

    this._search$.next();
  }

  get total$() { return this._total$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }

  get loading$() { return this._loading$.asObservable(); }



  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }


  get selectTypesEmergencyDisaster$(){
    return this.selectTypes$.asObservable();
  }


  setTypes(id: number){
    this.id = id;
    this.selectTypes$.next(id);
    this._search$.next();
  }


  get statusTypesEmergencyDisaster$(){
    return this.status$.asObservable();
  }


  setStatus(event){
    console.log("Evento => ", event)
    this.status$.next(event);
    this._search$.next();
  }



  get  emergencyDisasterObservable$ (){
    return this.emergencyDisaster$.asObservable();
  }
  
  get  emergencyDisasterObservableValue$ (){
    return this.emergencyDisaster$.value;
  }


  setEmergencyDisaster (emrgencyDisaster: EmergencyDisaster[]){
    this.emergencyDisaster$.next(emrgencyDisaster);
  }

  public deleteFromTable(id){
    const index =  this.emergencyDisaster.findIndex(x => x.emergencyDisasterID == id);

    let deleteEmergencyDisaster = this.emergencyDisaster.splice(index, 1);

    console.log("deleteUser =>", deleteEmergencyDisaster);

    this.uploadTable(this.emergencyDisaster);
  }
  

  
  /**Se debe realizar una funcion para la cual se actualice la tabla despues de cambiar datos de usuario */
/* public _setEmployee(patch:EmergencyDisaster){

  let index = this.emergencyDisaster.findIndex( x => patch.emergencyDisasterID == x.emergencyDisasterID);
  
  (index === -1) ? this.emergencyDisaster.push(patch) : this.emergencyDisaster[index] = patch;
  this._search$.next();
}

 */



  
  updateEmergencyDisaster(emergency: EmergencyDisaster[]){
    this.emergencyDisaster = emergency;
    console.log("SERVICIO", this.emergencyDisaster);
  }
  
  
  public uploadTable(EmergencyDisaster: EmergencyDisaster[]) {
    this.emergencyDisaster = EmergencyDisaster;
    this.emergencyDisaster$.next(EmergencyDisaster);
    this._search$.next();
  }
  
  
  status(EmergencyDisasterClone: EmergencyDisaster[]){
    
    
    if(this.status$.value){
      EmergencyDisasterClone = EmergencyDisasterClone.filter(data => data.emergencyDisasterEndDate !== null)
    }else if(!this.status$.value){
      
      EmergencyDisasterClone = EmergencyDisasterClone.filter(data => data.emergencyDisasterEndDate === null)
    }
    
    return  EmergencyDisasterClone;
    
  }
  
    private filterTypes(): Observable<SearchResult>{
  
      const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
  
      let emergency = this.status(this.emergencyDisaster);
      emergency = this.selectType(emergency)
  
  
      let data = sort(emergency, sortColumn, sortDirection);
  
      data = data.filter(employee => matches(employee, searchTerm, this.pipe));

      const total = data.length;
  
      data = data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  
      return of({data, total});
    }
  
  
  
  selectType(EmergencyDisasterClone: EmergencyDisaster[]){

    
    if(this.selectTypes$.value != 8){
      EmergencyDisasterClone = EmergencyDisasterClone.filter(data => data.typesEmergenciesDisasters['typeEmergencyDisasterID'] === this.selectTypes$.value)
    }
    
    
    return  EmergencyDisasterClone;
    
  }


}



