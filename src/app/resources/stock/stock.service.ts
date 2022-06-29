import { AuthenticationService } from 'src/app/services';
import { HttpClient } from '@angular/common/http';
import { Injectable, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Resource } from '../../models';
import { debounceTime, delay, filter, map, switchMap, tap ,catchError, concatMap, scan, shareReplay} from 'rxjs/operators';
import { BehaviorSubject, Observable, of, Subject, combineLatest, merge, throwError } from 'rxjs';
import { SearchResult, State } from 'src/app/models';
import {SortColumn, SortDirection} from '../../directives/sorteable.directive';
import { DecimalPipe } from '@angular/common';

import {  HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Action } from '../../shared/crud-action';


function matches(resource: Resource, term: string, pipe: PipeTransform) {
  return resource.name.toLowerCase().includes(term.toLowerCase())
     || pipe.transform(resource.id).includes(term)
     || pipe.transform(resource.quantity).includes(term)
     || (resource.locationCityName).toLowerCase().includes(term.toLowerCase())
     || (resource.estates.address).toLowerCase().includes(term.toLowerCase())
     || (resource.estates.estateTypes).toLowerCase().includes(term.toLowerCase())
    ;}
    const compare = (v1: string | number | any, v2: string | number | any) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

    function sort(resource: Resource[], column: SortColumn, direction: string): Resource[] {
      if (direction === '' || column === '') {
        return resource;
      } else {
        return [...resource].sort((a, b) => {
          const res = compare(a[column], b[column]);
          return direction === 'asc' ? res : -res;
        });
      }
    }



@Injectable()
export class StockService {
 private _resources$ = new BehaviorSubject<Resource[]>([]);


 private _type$ = new BehaviorSubject<string>('materiales');

 resource$ = this.http.get<Resource[]>(environment.URL + this._type$.value)
 .pipe(
   tap(data => console.log('Products: ', JSON.stringify(data))),
   catchError(this.handleError)
 );
 private _loading$ = new BehaviorSubject<boolean>(true);
 private _search$ = new Subject<void>();
 private _total$ = new BehaviorSubject<number>(0);
 private resources: Resource[]= [];
 private _item$ = new BehaviorSubject<Resource>(null);
 private _showAvailability$ = new BehaviorSubject<boolean>(false);
 private _state: State = {
   page: 1,
   pageSize: 5,
   searchTerm: '',
   sortColumn: '',
   sortDirection: ''
 };
  constructor(
    protected http: HttpClient,
    private pipe: DecimalPipe
  ) {

    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      this._resources$.next(result.data);
      this._total$.next(result.total);
    });
  
    this._search$.next();
  }

get resourcesValue(){  return this._resources$.value; }
get resources$(){return this._resources$.asObservable();}
get item$() { return this._item$.asObservable(); }
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
set type(type: string) {this._setType(type);}
set showAvailability(availability: boolean) {this._setAvailability(availability);}


private _set(patch: Partial<State>) {
  Object.assign(this._state, patch);
  this._search$.next();
}

public _setType(type:string){
  this._type$.next(type);
  // this._search$.next();
}
private _setAvailability(availability:boolean){
  this._showAvailability$.next(availability);
  this._search$.next();
}
/**Se debe realizar una funcion para la cual se actualice la tabla despues de cambiar datos de usuario */
public _setResources(patch:Resource){
  let index = this.resources.findIndex( x => patch.id == x.id);
  this.resources[index] = patch;
  this._search$.next();
}
  destroyResources(){
    this._resources$.next([]);
    this._type$.next('');
  //  this._search$.next();
    
  }

public deleteFromTable(id){
  const index =  this.resources.findIndex(x => x.id == id);
  let deleteUser = this.resources.splice(index, 1);
  console.log("deleteUser =>", deleteUser);
  this.uploadTable(this.resources);
}

public uploadTable(resources: Resource[]) {
  this.resources = resources;
  this._resources$.next(resources);
  this._search$.next();

}


  getAll() {
    return 
  }

  getById(id: number, patch: string) {
    return this.http.get<any>(environment.URL + patch + '/' + id);
  }
  register(resource, patch: string) {
    return this.http.post(environment.URL + patch, JSON.stringify(resource));
  }
  update(resource, patch: string) {
    return this.http.put(environment.URL + patch, JSON.stringify(resource));
  }

  delete(id, patch: string) {
    return this.http.delete(environment.URL + patch + '/' + id);
  }


  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
  
    // 1. filtrado por disponibilidad
     const resources = this.resources.filter(x => x.availability !== this._showAvailability$.value);
    
    // 1. sort
    let data = sort(resources, sortColumn, sortDirection);
  
    // 2. filter
    data = data.filter(employee => matches(employee, searchTerm, this.pipe));
  
    const total = data.length;
  
    // 3. paginate
    data = data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({data, total});
   }

   
  private handleError(err: HttpErrorResponse): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error(err);
    return throwError(() => errorMessage);
  }
}
