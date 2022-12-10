import { switchMap, delay, debounceTime, tap, map } from 'rxjs/operators';
import { EmergencyDisaster } from './../models/emergencyDisaster';
import { Observable, BehaviorSubject, of, Subject, forkJoin } from 'rxjs';
import { DataService } from 'src/app/services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Output, EventEmitter, PipeTransform } from '@angular/core';
import { SortDirection } from '@angular/material/sort';
import { SortColumn } from '../directives/sorteable.directive';
import { DecimalPipe } from '@angular/common';
import _ from 'lodash';
import {compare, Operation } from 'fast-json-patch';
import { environment } from 'src/environments/environment';
import { ReportService } from '../services/_report.service/report.service';


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
  alertStatus? : string;
}

  
const compares = (v1: string | number, v2: string | number) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(emergencyDisaster: EmergencyDisaster[], column: SortColumn, direction: string): EmergencyDisaster[] {
  if (direction === '' || column === '') {
    return emergencyDisaster;
  } else {
    return [...emergencyDisaster].sort((a, b) => {
      const res = compares(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}



function matches(data: EmergencyDisaster, term: string, pipe: PipeTransform) {
  return data.alertName?.toLowerCase().includes(term)
  || data.city?.toLowerCase().includes(term)
  || data.state?.toLowerCase().includes(term)
  || data.type?.toLowerCase().includes(term)
  || pipe.transform(data.emergencyDisasterID).includes(term)
  || data.employeeName?.toLowerCase().includes(term);
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
  private _types$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]); 
  
  private status$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false); 
  
  private _search$ = new Subject<void>();

  private _total$ = new BehaviorSubject<number>(0);



  emergencyDisaster: any [] = [];
  id: number;
  
  statusBoolean: boolean = true;
  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: '',
    alertStatus: 'Activa'
  };
  constructor(http: HttpClient, private pipe: DecimalPipe, private reportService: ReportService) { 
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

    // this._search$.next();
  }

  get total$() { return this._total$.asObservable(); }
  get page() { return this._state.page; }
  get pageSize() { return this._state.pageSize; }
  get searchTerm() { return this._state.searchTerm; }
  get alertStatus() { return this._state.alertStatus; }
  get loading$() { return this._loading$.asObservable(); }

  set page(page: number) { this._set({page}); }
  set pageSize(pageSize: number) { this._set({pageSize}); }
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
  set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
  set alertStatus(alertStatus: string) { this._setAlertStatus({alertStatus}); }
  set loading(value: boolean) {   this._loading$.next(value);  }



  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
  private _setAlertStatus(patch: Partial<State>) {
    Object.assign(this._state, patch);
    // this._search$.next();
  }


  get selectTypesEmergencyDisaster$(){
    return this.selectTypes$.asObservable();
  }


  setTypes(id: number){
    this.id = id;
    this.selectTypes$.next(id);
    this._search$.next();
  }
private _setLoading(value: boolean){
  this._loading$.next(value);
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
  get  types$ (){
    return this._types$.asObservable();
  }
  get  emergencyDisasterObservableValue$ (){
    return this.emergencyDisaster$.value;
  }

  set  emergencyDisasterObservableValue (alerts){
    this.emergencyDisaster = alerts;
    this.emergencyDisaster$.next(alerts);
  }

  setEmergencyDisaster (emrgencyDisaster: EmergencyDisaster[]){
    this.emergencyDisaster$.next(emrgencyDisaster);
    this._search$.next();
  }


  public _setEmployee(patch: any){
    let index = this.emergencyDisaster.findIndex( x => patch.emergencyDisasterID == x.emergencyDisasterID);
    if(index === -1) {
     this.emergencyDisaster.push(patch);
    } else {
      if(patch.FK_AlertID){
        patch.alerts.alertID = patch.FK_AlertID;

      }else{
         patch.FK_AlertID = patch.alerts.alertID;
      }
      this.emergencyDisaster[index] = patch;
    }
    this._search$.next();
  }



  public deleteFromTable(id){
    const index =  this.emergencyDisaster.findIndex(x => x.emergencyDisasterID == id);

    let deleteEmergencyDisaster = this.emergencyDisaster.splice(index, 1);

    console.log("deleteUser =>", deleteEmergencyDisaster);

    this.uploadTable(this.emergencyDisaster);
  }
  
  updateEmergencyDisaster(emergency: EmergencyDisaster[]){
    this.emergencyDisaster = emergency;
    console.log("SERVICIO", this.emergencyDisaster);
  }
  
  
  public uploadTable(EmergencyDisaster: EmergencyDisaster[]) {
    this.emergencyDisaster = EmergencyDisaster;
    this.emergencyDisaster$.next(EmergencyDisaster);
    console.log('Actualizadas las alertas de la tabla.');
    this._search$.next();
  }
  
  
  status(EmergencyDisasterClone: EmergencyDisaster[]){
    
    
    if(this._state.alertStatus){
      EmergencyDisasterClone = EmergencyDisasterClone.filter(data => data.state === this._state.alertStatus)
    }
    return  EmergencyDisasterClone;
    
  }
  
    private filterTypes(): Observable<SearchResult>{
  
      const {alertStatus,sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
      var emergency = this.emergencyDisaster;

      // if(alertStatus){
      // emergency = this.emergencyDisaster.filter(data => data.state === this._state.alertStatus);
      // }
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

  getAllWithoutFilter(params?: string): Observable<any> {
    
    // this._loading$.next(true);
  const  path : string  = "EmergenciesDisasters";
    if(params){
    const paramsObj = {
      // userId: JSON.stringify(userId) || undefined,
      limit: params || undefined
    };
    let parametro = new HttpParams({fromObject: paramsObj});
    this.options.params = parametro;
  }
  // else {
    return this.http.get<any>(environment.URL + path+'/WithoutFilter', this.options)
      .pipe(
        map(
          alertas => {
            let arrayTypes = [];
            alertas.forEach(item =>{
              // const types = {
              //   id: item.typesEmergenciesDisasters.typeEmergencyDisasterID,
              arrayTypes.push(item.typesEmergenciesDisasters.typeEmergencyDisasterName);
              
              // arrayTypes.push(types);
            });
            // arrayTypes.push("Todos");
            arrayTypes = this.removeDuplicates(arrayTypes);
            console.log('Array types => ',arrayTypes);
            this.reportService.alertTypes = arrayTypes;
            this.reportService.data = alertas;
            this.emergencyDisaster = alertas;
            this.emergencyDisaster$.next(alertas);
            return alertas
          }
          ));
    // return this.http.get<any>(environment.URL + path+'/WithoutFilter').pipe(map(alertas => {this.setEmergencyDisaster(alertas); return alertas}));

  // }
}
removeDuplicates(arr) {
  return [...new Set(arr)];
}
}



