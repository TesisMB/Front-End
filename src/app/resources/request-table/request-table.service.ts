import { ReportService } from 'src/app/services/_report.service/report.service';
import { AuthenticationService } from 'src/app/services';
import { Injectable, PipeTransform } from '@angular/core';


import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import { debounceTime, delay, switchMap, tap, filter, map } from 'rxjs/operators';
import {SortColumn, SortDirection} from '../../directives/sorteable.directive';
import * as _ from 'lodash';
import { RequestGet, SearchResult, State, User } from 'src/app/models';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';



const ROLES = ['Encargado de Logistica', 'Admin', 'Coord. General'];
const compare = (v1: string | number | any, v2: string | number | any) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

// const formateDate = (date, from, to?) =>
//   moment(date).isSameOrAfter(from) ||
//   moment(date).isBetween(from, to) ||
//   moment(date).isSameOrBefore(to);

function sort(request: RequestGet[], column: SortColumn, direction: string): RequestGet[] {
  if (direction === '' || column === '') {
    return request;
  } else {
    return [...request].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function search(request: RequestGet, term: string, pipe: PipeTransform): RequestGet[] {
  return  request.createdByEmployee.toLowerCase().includes(term)
        || request.condition.toLowerCase().includes(term)
        || request.typeEmergencyDisasterName.toLowerCase().includes(term)
        || request.locationMunicipalityName?.toLowerCase().includes(term)
        || request.locationDepartmentName?.toLowerCase().includes(term)
        || pipe.transform(request.id).includes(term);
  }


@Injectable({
  providedIn: 'root'
})
export class RequestTableService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _request$ = new BehaviorSubject<RequestGet[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private request: RequestGet[]= [];
  private _condition$ = new BehaviorSubject<string>('Pendiente');
  private _filter$ = new BehaviorSubject<boolean>(false);
  private currentUser = null;
  private _alertType = '';
  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };

  constructor(private pipe: DecimalPipe, private authService: AuthenticationService, protected http: HttpClient) {    
    this._search$.pipe(
    tap(() => this._loading$.next(true)),
    debounceTime(200),
    switchMap(() => this._search()),
    delay(200),
    tap(() => this._loading$.next(false))
  ).subscribe(result => {
    this._request$.next(result.data);
    this._total$.next(result.total);
  });

  // this._search$.next();

  this.authService.currentUser.subscribe(cUser => this.currentUser = cUser);
}
get requestValue(){  return this._request$.value; }
get request$() { return this._request$.asObservable(); }
get total$() { return this._total$.asObservable(); }
get loading$() { return this._loading$.asObservable(); }
get filter$(){ return this._filter$.asObservable();}
get page() { return this._state.page; }
get pageSize() { return this._state.pageSize; }
get searchTerm() { return this._state.searchTerm; }
get alertType() { return this._alertType};
set page(page: number) { this._set({page}); }
set pageSize(pageSize: number) { this._set({pageSize}); }
set searchTerm(searchTerm: string) { this._set({searchTerm}); }
set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
set condition(condition: string) {this._setCondition(condition);}
set loadTable(request: any) {this._uploadTable(request);}
set updateRequest(request: RequestGet){this._updateRequest(request);}
set loading(value: boolean){this._setLoading(value);}
set filter(f:boolean){
  this._filter$.next(f);
  this._search$.next();
}
set alertType(type: string){
  this._alertType = type;
}

private _set(patch: Partial<State>) {
  Object.assign(this._state, patch);
  this._search$.next();
}

private _setLoading(value: boolean) {
  this._loading$.next(value);
}

public _setCondition(condition:string){
  this._condition$.next(condition);
  // this._search$.next();
}
/**Se debe realizar una funcion para la cual se actualice la tabla despues de cambiar datos de usuario */
public _updateRequest(patch:RequestGet){
  const index = this._request$.value.findIndex( x => patch.id == x.id);
  this._request$.value[index] = patch;
  this._uploadTable(this._request$.value);

}
public deleteFromTable(id){
  var request = this._request$.value;
  const index =  request.findIndex(x => x.id == id);
  let deleteRequest = request.splice(index, 1);

  console.log("deleteUser =>", deleteRequest);
  this._uploadTable(request);
}

public _uploadTable(_request: RequestGet[]) {
  this.request = _request;
  console.log(_request);
  this._request$.next(_request);
  this._search$.next();
}

public cargarTabla(){
  this._search$.next();
}

ObtenerSolicitud(id){
  const index =  this._request$.value.findIndex(x => x.id === id);
  return index;
}

generatePDF(id, tab?): Observable<any> {
  const headers = new HttpHeaders().set('Accept','application/pdf');
  return this.http.get(environment.URL + 'resourcesrequest/' + 'pdf/' + id, 
      {
        headers: headers,
        responseType: 'blob'
      }
    );
  }


private _search(): Observable<SearchResult> {
  const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
  // const to = this.reportService.to;
  // const from= this.reportService.from; 
  // 1. filtrado por usuario
  var req = this._request$.value;
  if(this._filter$.value || !ROLES.includes(this.currentUser.roleName)){
    req = this._request$.value.filter(x => x.createdBy === this.currentUser.userID);
  }
  
  // 1. sort
  let data = sort(req, sortColumn, sortDirection);

//filter for day

  // data = from || to
  //   ? data.filter((data) => formateDate(data.requestDate , from, to))
  //   : data;
  // 2. filter
  data = data.filter(request => search(request, searchTerm, this.pipe));
  if(this.alertType){
    data = data.filter(request => request.typeEmergencyDisasterName === this.alertType);
  }

  const total = data.length;

  // 3. paginate
  data = data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  console.log('data paginate => ',data);
  console.log('pageSize => ',pageSize);
  console.log('page => ',page);
  return of({data, total});
 }


 openDialog(){
  
 }

  
  }
    
