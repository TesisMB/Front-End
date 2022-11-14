import { Injectable, PipeTransform } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Resource,ReportData,Reports, SearchReport } from 'src/app/models/index';
import { debounceTime, delay, filter, map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, of, Subject, pipe } from 'rxjs';
import { DecimalPipe } from '@angular/common';
import * as moment from 'moment';
import { SearchResult, State } from 'src/app/models';
import { result } from 'lodash';

function matches(term: string, pipe: PipeTransform, data: any, path: string) {
  var dataSearch = {};
  var objectType = this._backUpData$.value;
  if(objectType?.interface.contains('')){
    dataSearch = (data.name).toLowerCase().includes(term.toLowerCase())
    || (data.id).toLowerCase().includes(term.toLowerCase())
    || pipe.transform(data.quantity).includes(term)
    || (data.locationCityName).toLowerCase().includes(term.toLowerCase())
    || (data.estates.address).toLowerCase().includes(term.toLowerCase())
    || (data.estates.estateTypes).toLowerCase().includes(term.toLowerCase());
  } 
  return dataSearch;
  }
  const compares = (v1: string | number | any, v2: string | number | any) => v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  const formateDate = (date,from, to?) => moment(date).isSameOrAfter(from) || moment(date).isBetween(from,to) || moment(date).isSameOrBefore(to);
  const name = (path: string, value: boolean | number | any) =>  
  path.includes('donation') ? (value ? 'Recursos donados' : 'Recursos no donados') : path.includes('availability') ? (value ? 'Disponibles' : 'No Disponibles') : value;

@Injectable({
  providedIn: 'root'
})
export class ReportService{
public patch: string = '';
private _data$ = new BehaviorSubject<any>([]);
private _backUpData$ = new BehaviorSubject<any>([]);
private _type$ = new BehaviorSubject<string>('table');
private _path$ = new BehaviorSubject<string>('');
private _location$ = new BehaviorSubject<any>('');
private _loading$ = new BehaviorSubject<boolean>(true);
private _search$ = new Subject<void>();
private _reports$ = new Subject<void>();
private _total$ = new BehaviorSubject<number>(0);
private _hasAvailability$ = new BehaviorSubject<boolean>(false);
private _hasStatus$ = new BehaviorSubject<string>('');
private _hasDonation$ = new BehaviorSubject<boolean>(false);
private _state: SearchReport = {
  searchPath: 'name',
  searchTerm: '',
  searchType: 'table',
  searchLocation: '',
};
  constructor(private pipe?: DecimalPipe)
      {
    this._search$.pipe(
      tap(() => this._loading$.next(true)),
      debounceTime(200),
      switchMap(() => this._search()),
      delay(200),
      tap(() => this._loading$.next(false))
    ).subscribe(result => {
      console.log('Paso por el search => ',result);
      this._data$.next(result.data);
      this._total$.next(result.total);
      this._type$.next(result.searchType);
    }, (error) => { console.log('Paso por el error => ',error);});

  }

  get data$ (){ return this._data$.asObservable(); }
  get type$ (){ return this._type$.asObservable(); }
  get path$ (){ return this._path$.asObservable(); }
  get location$ (){ return this._location$.asObservable(); }
  get loading$ (){ return this._loading$.asObservable(); }
  get total$ (){ return this._total$.asObservable(); }
  get hasAvailability$ (){ return this._hasAvailability$.asObservable(); }
  get hasStatus$ (){ return this._hasStatus$.asObservable(); }
  get hasDonation$ (){ return this._hasDonation$.asObservable(); }
  get searchPath() { return this._state.searchPath; }
  get searchType() { return this._state.searchType; }
  get searchLocation() { return this._state.searchLocation; }


  set searchLocation(searchLocation: number) { this._set({searchLocation});}
  set searchTerm(searchTerm: string) { this._set({searchTerm}); }
  set searchPath(searchPath: string) { this._set({searchPath}); }
  set searchType(searchType: string) { this._set({searchType}); }
  set loading(value: boolean){this._setLoading(value);}
  set location(value: number | any){this._setLocation(value);}
  set data(value: any){this._setData(value);}
  set type(value: string){this._setType(value);}
  set hasAvailability(value: boolean){this._setAvailability(value);}
  set hasStatus(value: string){this._setStatus(value);}
  set hasDonation(value: boolean){this._setDonation(value);}

  private _set(patch: Partial<SearchReport>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
  private _setData(data: any) {
    this._backUpData$.next(data);
    this._search$.next();
  }
  private _setLoading(value : boolean){
    this._loading$.next(value);
  }
  private _setType(type:string){
    this._type$.next(type);
  }  

 private _setStatus(status: string){
  this._hasStatus$.next(status);
  this._search$.next();
  }

  private _setLocation(location: any | number){
    this._location$.next(location);
    this.searchLocation = location;
    // this._search$.next();
  }
  private _setAvailability(availability:boolean){
    console.log('EJecutando setAvailability => ', availability);
    this._hasAvailability$.next(availability);
    this._search$.next();
  }  
  private _setDonation(value:boolean){
    console.log('EJecutando setDonation => ', value);
    this._hasDonation$.next(value);
    this._search$.next();
  }

  private structuredDate(object:any ,path: any){
    var data = [];
    if(path === 'recursos'){
      const materiales = 'materiales';
      const medicamentos = 'medicamentos';
      const vehiculos = 'vehiculos';

      data = [...object.reduce( (mp, o) => {
        if (!mp.has(materiales)) mp.set(materiales, { name: materiales, value: 0});
        mp.get(materiales).value +=  o.recursos.materiales;
        if (!mp.has(medicamentos)) mp.set(medicamentos, { name: medicamentos, value:0 });
        mp.get(medicamentos).value +=  o.recursos.medicamentos;
        if (!mp.has(vehiculos)) mp.set(vehiculos, { name: vehiculos, value: 0 });
        mp.get(vehiculos).value += o.recursos.vehiculos;
        return mp;
      }, new Map).values()];
    }
    else {
      data = [...object.reduce( (mp, o) => {
    if (!mp.has(o[path])) mp.set(o[path], { name: name(path,o[path]), value: 0 });
    path.includes('name') ? mp.get(o.name).value += o.quantity : mp.get(o[path]).value++;
    return mp;
  }, new Map).values()];
}
return data;
}

private _search(): Observable<SearchResult> {
    
  const {searchType,searchPath, searchTerm} = this._state;
  var data: any
  var total: number = 0;


   // 1. filtrado por disponibilidad
  if(this._hasStatus$.value){
     data = this._backUpData$.value.filter(x => x.state === this._hasStatus$.value);
  }

   // 1. filtrado por disponibilidad
  if(this._hasAvailability$.value){
    let d = data ? data : this._backUpData$.value;

    data = d.filter(x => x.availability !== this._hasAvailability$.value);
  }

  
   // 2. filtrado por donación

  if(this._hasDonation$.value){
    let d = data ? data : this._backUpData$.value;
    data = d.filter(x => x.donation === this._hasDonation$.value);
  }
  data = data ? data : this._backUpData$.value;
  // 3. filtrado por busqueda.
  // data = data.filter(data => matches(searchTerm, this.pipe, data));

  // 4. Estructuración de datos.
  data = this.structuredDate(data,searchPath);
  console.log('Data del search => ',data);
  // 5. Sumatoria total de valores.
  data.forEach(element => total += element.value);

  return of({data, total,searchType});
 }

  }

