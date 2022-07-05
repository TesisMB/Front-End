import { AuthenticationService } from 'src/app/services';
import { HttpClient, HttpEvent, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Resource } from '../models';
import { pipe } from 'rxjs';
import { debounceTime, delay, filter, map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { SearchResult, State } from 'src/app/models';
import {SortColumn, SortDirection} from '../directives/sorteable.directive';
import { DecimalPipe } from '@angular/common';
import {compare, Operation } from 'fast-json-patch';
import * as _ from 'lodash';
import { constants } from 'buffer';
import { StringMapWithRename } from '@angular/compiler/src/compiler_facade_interface';

function matches(resource: Resource, term: string, pipe: PipeTransform) {
  return (resource.name).toLowerCase().includes(term.toLowerCase())
  || (resource.id).toLowerCase().includes(term.toLowerCase())
  || pipe.transform(resource.quantity).includes(term)
  || (resource.locationCityName).toLowerCase().includes(term.toLowerCase())
  || (resource.estates.address).toLowerCase().includes(term.toLowerCase())
  || (resource.estates.estateTypes).toLowerCase().includes(term.toLowerCase())
 ;}
    const compares = (v1: string | number | any, v2: string | number | any) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;

    function sort(resource: Resource[], column: SortColumn, direction: string): Resource[] {
      if (direction === '' || column === '') {
        return resource;
      } else {
        return [...resource].sort((a, b) => {
          const res = compares(a[column], b[column]);
          return direction === 'asc' ? res : -res;
        });
      }
    }



@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  protected options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
    params: new HttpParams() };
 
  private _resources$ = new BehaviorSubject<Resource[]>([]);
 protected _type$ = new BehaviorSubject<string>('');
 private _loading$ = new BehaviorSubject<boolean>(true);
 private _search$ = new Subject<void>();
 private _total$ = new BehaviorSubject<number>(0);
 private resources: Resource[]= [];
 private _item$ = new BehaviorSubject<Resource>(null);
 private _imgFile$ = new BehaviorSubject<File>(null);
 private _showAvailability$ = new BehaviorSubject<boolean>(false);




 private _state: State = {
   page: 1,
   pageSize: 5,
   searchTerm: '',
   sortColumn: '',
   sortDirection: ''
 };
  public vehiclesTypes$ : Observable<any>;
  constructor(
    protected http: HttpClient,
    private pipe?: DecimalPipe
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

    this.vehiclesTypes$ = this.http.get<any>(environment.URL + 'typesvehicles').pipe(tap(x => console.log('Types of vehicles => ',x)));
  }

get resourcesValue(){  return this._resources$.value; }
get resources$(){return this._resources$.asObservable();}
get item$() { return this._item$.asObservable(); }
get total$() { return this._total$.asObservable(); }
get loading$() { return this._loading$.asObservable(); }
get imgFile$() { return this._imgFile$.asObservable(); }
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
set loading(load:any){this._setLoading(load);}

private _set(patch: Partial<State>) {
  Object.assign(this._state, patch);
  this._search$.next();
}
private _setLoading(load){
  this._loading$.next(load);
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

public changeStatusItem(id:string){
  let index = this.resources.findIndex( x => id == x.id);
  const clone = _.cloneDeep(this.resources[index]);
  this.resources[index].availability = !this.resources[index].availability;
  const patch = compare(clone , this.resources[index] );
  this._search$.next();
  return patch;
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


  getAll(userID: number) {
    let paramaters = new HttpParams().append('userId', JSON.stringify(userID));
    this.options.params = paramaters;

    return this.http
      .get<Resource[]>(environment.URL + this._type$.value, this.options)
       .pipe(map((resources: Resource[]) => {
          if(resources.length){
            this._resources$.next(resources);
            this.resources = resources;
            this._search$.next();

          }
          else{
            this._resources$.next(null);
          }
          return resources;
       }
       ));
  }

  getById(id: string, patch: string) {
    return this.http.get<any>(environment.URL + patch + '/' + id);
  }
  register(resource, patch: string) {

    return this.http.post(environment.URL + patch, resource);
  }
  update(patch ,id, operations?: Operation[]) {
    return this.http.patch(environment.URL + patch+ '/' + id, operations)
    .pipe(map( x => {    
    return x
    }));
  }

  upload(file: File ){
    const ImageFile: FormData = new FormData();
    ImageFile.append('file', file);
  //  this._imgFile$.next(file);
   // resource.imageFile = ImageFile;
    const req = new HttpRequest('POST', `${environment.URL}upload`, ImageFile, {
      reportProgress: true,
      responseType: 'text'
    });
    return this.http.request(req);
  }

  
  generatePDFResources(startDate: String, tipo: String): Observable<any> {
    // let paramaters = new HttpParams().append('startDate', JSON.stringify(startDate));
    // this.options.params = paramaters;

    let url = environment.URL + 'estates' + '/pdf/?dateStart=' + startDate;

    if(tipo == 'get'){
      url = environment.URL + 'estates' + '/pdf/?dateStart=' + startDate;
    }else{
      url = environment.URL + 'estates' + '/pdf/?dateStart=' + startDate + '&getall=todas';
    }


    const headers = new HttpHeaders().set('Accept','application/pdf');
    return this.http.get(url, 
        {
          headers: headers,
          responseType: 'blob'
        }
      );
    }


  getFiles(): Observable<any> {
     return this.http.get(`${environment.URL}files`);
  }


  delete(id, patch: string) {
    return this.http.delete(environment.URL + patch + '/' + id)
    .pipe(map( x => {
      this.deleteFromTable(id);
      return x
    }));
  }

  
  generatePDF(id): Observable<any> {
    const headers = new HttpHeaders().set('Accept','application/pdf');
    return this.http.get(environment.URL + 'pdf/' + id, 
        {
          headers: headers,
          responseType: 'blob'
        }
      );
    }

  private _search(): Observable<SearchResult> {
    const {sortColumn, sortDirection, pageSize, page, searchTerm} = this._state;
  
    // 1. filtrado por disponibilidad
     const resources = this.resources.filter(x => x.availability !== this._showAvailability$.value);
    
    // 1. sort
    let data = sort(this.resources, sortColumn, sortDirection);
  
    // 2. filter
    data = data.filter(employee => matches(employee, searchTerm, this.pipe));
  
    const total = data.length;
  
    // 3. paginate
    data = data.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize);
    return of({data, total});
   }
}
