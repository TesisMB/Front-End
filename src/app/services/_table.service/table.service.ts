import { Employee } from './../../models/employee';
import { AlertService } from './../_alert.service/alert.service';
import { Injectable, PipeTransform} from '@angular/core';


import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {DecimalPipe} from '@angular/common';
import { debounceTime, delay, switchMap, tap, filter, map } from 'rxjs/operators';
import {SortColumn, SortDirection} from '../../directives/sorteable.directive';
import { UserService } from 'src/app/users';
import * as _ from 'lodash';


interface SearchResult {
  _employees: Employee[];
  total: number;
}

interface State {
  page: number;
  pageSize: number;
  searchTerm: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
}

const compare = (v1: string | number | any, v2: string | number | any) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

function sort(employees: Employee[], column: SortColumn, direction: string): Employee[] {
  if (direction === '' || column === '') {
    return employees;
  } else {
    return [...employees].sort((a, b) => {
      const res = compare(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

function matches(employee: Employee, term: string, pipe: PipeTransform) {
  return employee.users.userDni.includes(term)
    || employee.users.persons.lastName.toLowerCase().includes(term.toLowerCase())
    || (employee.users.persons.firstName).toLowerCase().includes(term.toLowerCase())
    || (employee.users.roleName).toLowerCase().includes(term.toLowerCase())
    || (employee.users.estates.address).toLowerCase().includes(term.toLowerCase())
    || pipe.transform(employee.users.estates.numberAddress).includes(term);
}


@Injectable({
  providedIn: 'root'
})
export class TableService {

  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  private _employees$ = new BehaviorSubject<Employee[]>([]);
  private _total$ = new BehaviorSubject<number>(0);
  private EMPLEADOS: Employee[]= [];
  private _showAvailability$ = new BehaviorSubject<boolean>(false);
  private _state: State = {
    page: 1,
    pageSize: 4,
    searchTerm: '',
    sortColumn: '',
    sortDirection: ''
  };
  constructor(private pipe: DecimalPipe, private service: UserService, private alertService: AlertService) {

    this._search$.pipe(
    tap(() => this._loading$.next(true)),
    debounceTime(200),
    switchMap(() => this._search()),
    delay(200),
    tap(() => this._loading$.next(false))
  ).subscribe(result => {
    this._employees$.next(result._employees);
    this._total$.next(result.total);
  });

  this._search$.next();
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

private _set(patch: Partial<State>) {
  Object.assign(this._state, patch);
  this._search$.next();
}

private _setAvailability(availability:boolean){
  this._showAvailability$.next(availability);
  this._search$.next();
}
/**Se debe realizar una funcion para la cual se actualice la tabla despues de cambiar datos de usuario */
public _setEmployee(patch:Employee){
  let index = this.EMPLEADOS.findIndex( x => patch.employeeID == x.employeeID);
  this.EMPLEADOS[index] = patch;
  this._search$.next();
}

public uploadTable() {

  this.service.getAll()
  .subscribe(
    (result: Employee[]) => {
      this.EMPLEADOS = result;
      console.log('GetAll AJAX ejecutado');
    console.log('Empleados: ', this.EMPLEADOS);

   },
     error => {
       console.log('Error: ' + error.message);
       this.alertService.error('No se ha podido cargar, intentelo nuevamente más tarde.');
      });

    this._search$.next();

}

private _search(): Observable<SearchResult> {
  const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;

  // 1. filtrado por disponibilidad
  const empleados = this.EMPLEADOS.filter(x => x.users.userAvailability !== this._showAvailability$.value);

  // 1. sort
  let _employees = sort(empleados, sortColumn, sortDirection);

  // 2. filter
  _employees = _employees.filter(employee => matches(employee, searchTerm, this.pipe));

  const total = _employees.length;

  // 3. paginate
  _employees = _employees.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
  return of({_employees, total});
 }
}

