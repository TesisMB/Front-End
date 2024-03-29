import { Employee, User } from 'src/app/models';
import { Injectable, PipeTransform} from '@angular/core';

import {SortColumn, SortDirection} from '../../directives/sorteable.directive';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import { debounceTime, delay, switchMap, tap, filter, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { SearchResult, State } from 'src/app/models';


const compare = (v1: string | number | any, v2: string | number | any) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(employees: User[], column: SortColumn, direction: string): User[] {
  if (direction === '' || column === '') {
    return employees;
  } else {
    return [...employees].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(employee: User, term: string, pipe: PipeTransform) {
  return employee.userDni.includes(term)
    || employee.persons.lastName.toLowerCase().includes(term.toLowerCase())
    || (employee.persons.firstName).toLowerCase().includes(term.toLowerCase())
    || (employee.roleName).toLowerCase().includes(term.toLowerCase())
    || (employee.estates.address).toLowerCase().includes(term.toLowerCase());

}


@Injectable({
  providedIn: 'root'
})
export class TableService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _employees$ = new BehaviorSubject<User[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private EMPLEADOS: User[]= [];
  private _showAvailability$ = new BehaviorSubject<boolean>(false);
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
    this._employees$.next(result.data);
    this._total$.next(result.total);
  });

  // this._search$.next();
}
get empleadosValue(){  return this._employees$.value; }
get employees$() { return this._employees$.asObservable(); }
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
set showAvailability(availability: boolean) {this._setAvailability(availability);}
// set loading$(value: any){this.setLoading(value);}

private _set(patch: Partial<State>) {
  Object.assign(this._state, patch);
  this._search$.next();
}

private _setAvailability(availability:boolean){
  this._showAvailability$.next(availability);
  this._search$.next();
}

public setLoading(value:boolean){
  this._loading$.next(value);
}
/**Se debe realizar una funcion para la cual se actualice la tabla despues de cambiar datos de usuario */
public _setEmployee(patch:User){
  let index = this.EMPLEADOS.findIndex( x => patch.userID == x.userID);
  
  (index === -1) ? this.EMPLEADOS.push(patch) : this.EMPLEADOS[index] = patch;
  this._search$.next();
}

public deleteFromTable(id){
  const index =  this.EMPLEADOS.findIndex(x => x.userID == id);
  let deleteUser = this.EMPLEADOS.splice(index, 1);
  console.log("deleteUser =>", deleteUser);
  this.uploadTable(this.EMPLEADOS);
}

public uploadTable(employees: User[]) {
  this.EMPLEADOS = employees;
  this._employees$.next(employees);
  this._search$.next();

}

private _search(): Observable<SearchResult> {
  const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

  // 1. filtrado por disponibilidad
  //const empleados = this.EMPLEADOS.filter(x =>( x.users.userAvailability !== this._showAvailability$.value) && x.users.roleName !== 'Voluntario');
  const empleados = this.EMPLEADOS.filter(x =>( x.userAvailability !== this._showAvailability$.value));
  
  // 1. sort
  let data = sort(empleados, sortColumn, sortDirection);

  // 2. filter
  data = data.filter(employee => matches(employee, searchTerm, this.pipe));

  const total = data.length;

  // 3. paginate
  data = data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  return of({data, total});
 }
}

