import { Injectable, PipeTransform } from '@angular/core';


import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import { debounceTime, delay, switchMap, tap, filter, map } from 'rxjs/operators';
import {SortColumn, SortDirection} from '../../directives/sorteable.directive';
import * as _ from 'lodash';
import { RequestGet, SearchResult, State } from 'src/app/models';





const compare = (v1: string | number | any, v2: string | number | any) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

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
  return  request.users.name.toLowerCase().includes(term)
        || request.condition.toLowerCase().includes(term)
        || request.emergenciesDisasters.typesEmergenciesDisasters.typeEmergencyDisasterName.toLowerCase().includes(term)
        || request.emergenciesDisasters.locations.locationMunicipalityName.toLowerCase().includes(term)
        || request.emergenciesDisasters.locations.locationDepartmentName.toLowerCase().includes(term)
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
  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };
  constructor(private pipe: DecimalPipe) {    
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

  this._search$.next();
}
get requestValue(){  return this._request$.value; }
get request$() { return this._request$.asObservable(); }
get total$() { return this._total$.asObservable(); }
get loading$() { return this._loading$.asObservable(); }
get page() { return this._state.page; }
get pageSize() { return this._state.pageSize; }
get searchTerm() { return this._state.searchTerm; }

set page(page: number) { this._set({page}); }
set pageSize(pageSize: number) { this._set({pageSize}); }
set searchTerm(searchTerm: string) { this._set({searchTerm}); }
set sortColumn(sortColumn: SortColumn) { this._set({sortColumn}); }
set sortDirection(sortDirection: SortDirection) { this._set({sortDirection}); }
set condition(condition: string) {this._setCondition(condition);}
set loadTable(request: any) {this._uploadTable(request);}
set uodateRequest(request: RequestGet){this._updateRequest(request);}

private _set(patch: Partial<State>) {
  Object.assign(this._state, patch);
  this._search$.next();
}

public _setCondition(condition:string){
  this._condition$.next(condition);
  this._search$.next();
}
/**Se debe realizar una funcion para la cual se actualice la tabla despues de cambiar datos de usuario */
public _updateRequest(patch:RequestGet){
  let index = this.request.findIndex( x => patch.id == x.id);
  this.request[index] = patch;
  this._search$.next();
}


public _uploadTable(_request: RequestGet[]) {
  this.request = _request;
  this._request$.next(_request);
  this._search$.next();

}

private _search(): Observable<SearchResult> {
  const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

  // 1. filtrado por disponibilidad
 // const empleados = this.request.filter(x => x.condition === this._condition$.value);
  
  // 1. sort
  let data = sort(this.request, sortColumn, sortDirection);

  // 2. filter
  data = data.filter(request => search(request, searchTerm, this.pipe));

  const total = data.length;

  // 3. paginate
  data = data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  return of({data, total});
 }

  
  }
    
