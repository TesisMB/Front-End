import { Inject, Injectable, LOCALE_ID, PipeTransform } from '@angular/core';
import {
  Resource,
  ReportData,
  Reports,
  SearchReport,
  User,
} from 'src/app/models/index';
import {
  debounceTime,
  delay,
  map,
  switchMap,
  tap,
  filter,
} from 'rxjs/operators';
import { BehaviorSubject, Observable, of, Subject, pipe } from 'rxjs';
import { DecimalPipe,formatDate } from '@angular/common';
import * as moment from 'moment';
import { SearchResult, State } from 'src/app/models';
import { NavigationEnd, Router } from '@angular/router';
import { isString } from 'lodash';
import { notStrictEqual } from 'assert';



const compares = (v1: string | number | any, v2: string | number | any) =>
  v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
function formateDate(date, from, to?) {
  if(isString(date)){
    if(!date.includes('/')){
      date = new Date(date);
      console.log('first Date',date); // 👉️ "07"
      date = new Date( date.getFullYear(), date.getMonth(),  date.getDate());
      console.log('Second Date ',date); // 👉️ "07"
    } else {
      console.log(date); // outputs 2020-05-02  
      const [day,month, year] = date.split('/');
      console.log(month); // 👉️ "07"
      console.log(day); // 👉️ "21"
      console.log(year); // 👉️ "2024"
      date = new Date(+year, +month - 1, +day);
    }
  // let momentVariable = moment(date, 'DD/MM/YYYY');  
  // let stringvalue = momentVariable.format('DD/MM/YYYY'); 
// let curr = formatDate(date, 'DD/MM/YYYY' ,this.locale);
  }
  var isMoment: boolean = false;
  if(to && from){
    isMoment = moment(date).isBetween(from, to);
  }else if(from){
   isMoment = moment(date).isSameOrAfter(from);
  } else if(to){
    isMoment = moment(date).isSameOrBefore(to);
  }
  return isMoment;
}
const name = (path: string, value: boolean | number | any) =>
  path.includes('donation')
    ? value
      ? 'Recursos donados'
      : 'Recursos no donados'
    : path === 'availability' || path === 'enabled'
    ? value
      ? 'Disponibles'
      : 'No Disponibles'
    : value;

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  public currentRoute: any = '';
  public path: any = '';
  private datePath: string = '';
  private currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
  private _data$ = new BehaviorSubject<any>([]);
  private backUpData : any[] = [];
  private _originalData$ = new BehaviorSubject<any>([]);
  private _backUpData$ = new BehaviorSubject<any>([]);
  private _type$ = new BehaviorSubject<string>('table');
  private _path$ = new BehaviorSubject<string>('');
  private _location$ = new BehaviorSubject<any>(
    this.currentUser.estates.locationID
  );
  private _loading$ = new BehaviorSubject<boolean>(false);
  private _search$ = new Subject<void>();
  private _reports$ = new Subject<void>();
  private _total$ = new BehaviorSubject<number>(0);
  private _hasAvailability$ = new BehaviorSubject<boolean>(false);
  private _hasStatus$ = new BehaviorSubject<string>('');
  private _hasDonation$ = new BehaviorSubject<boolean>(false);
  private _alertTypes$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]); 

  private _state: SearchReport = {
    searchPath: 'name',
    searchTerm: '',
    searchType: 'table',
    searchLocation: this.currentUser.estates.locationID,
    from: '',
    to: '',
    alertStatus: 'Activa',
    alertType:''
  };
  constructor(private router: Router,@Inject(LOCALE_ID) public locale: string, private pipe?: DecimalPipe,) {
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        delay(200),
        tap(() => this._loading$.next(false))
      )
      .subscribe(
        (result) => {
          console.log('Paso por el search => ', result);
          this._data$.next(result.data);
          this._total$.next(result.total);
          this._type$.next(result.searchType);
          this._originalData$.next(result.originalData);
        },
        (error) => {
          console.log('Paso por el error => ', error);
        }
      );

    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        if (event.url.includes('stock')) {
          this.currentRoute = 'stock';
          this._state.searchPath = 'name';
          this.path = 'name';
        } else if (event.url.includes('emergencias')) {
          this.currentRoute = 'emergencias';
          this._state.searchPath = ['alertName','type','city','state'];
          this.path = ['alertName','type','city','state'];
          this.datePath = 'emergencyDisasterStartDate';
        } else if (event.url.includes('solicitudes')) {
          this.currentRoute = 'solicitudes';
          this._state.searchPath = ['condition','createdByEmployee','typeEmergencyDisasterName','locationCityName' ];
          this.path = ['condition','createdByEmployee','typeEmergencyDisasterName','locationCityName' ];
          this.datePath = 'requestDate';
        }
        console.log(event.url);
      }
    });
  }

  get data$() {
    return this._data$.asObservable();
  }
  get backUpData$() {
    return this._backUpData$.asObservable();
  }  
  get getBackUpData() {
    return this.backUpData;
  }
  get originalData$() {
    return this._originalData$.asObservable();
  }
  get type$() {
    return this._type$.asObservable();
  }
  get path$() {
    return this._path$.asObservable();
  }
  get location$() {
    return this._location$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get total$() {
    return this._total$.asObservable();
  }
  get hasAvailability$() {
    return this._hasAvailability$.asObservable();
  }
  get hasStatus$() {
    return this._hasStatus$.asObservable();
  }
  get hasDonation$() {
    return this._hasDonation$.asObservable();
  }
  get searchPath() {
    return this._state.searchPath;
  }
  get searchType() {
    return this._state.searchType;
  }
  get searchLocation() {
    return this._state.searchLocation;
  }
  get from() {
    return this._state.from;
  }
  get to() {
    return this._state.to;
  }
  get alertType() {
    return this._state.alertType;
  }
  get alertStatus() {
    return this._state.alertStatus;
  }
  get alertTypes$ (){
    return this._alertTypes$.asObservable();
  }

  set alertTypes(types: string[]){
    this._alertTypes$.next(types);
  }
  set searchLocation(searchLocation: number) {
    this._set({ searchLocation });
  }
  set alertStatus(alertStatus: string) {
    this._set({ alertStatus });
  }
  set alertType(alertType: string) {
    this._set({ alertType });
  }
  set searchTerm(searchTerm: string) {
    this._set({ searchTerm });
  }
  set searchPath(searchPath: string | string[] | any) {
    this._setPath({ searchPath });
  }
  set searchType(searchType: string) {
    this._set({ searchType });
  }
  set from(from: string | Date | any) {
    this._set({ from });
  }
  set to(to: string | Date | any) {
    this._set({ to });
  }
  set loading(value: boolean) {
    this._setLoading(value);
  }
  set location(value: number | any) {
    this._setLocation(value);
  }
  set data(value: any) {
    this._setData(value);
  }
  set type(value: string) {
    this._setType(value);
  }
  set hasAvailability(value: boolean) {
    this._setAvailability(value);
  }
  set hasStatus(value: string) {
    this._setStatus(value);
  }
  set hasDonation(value: boolean) {
    this._setDonation(value);
  }
  set BackUpData$(data:any) {
    this._backUpData$.next(data);
    this._search$.next();
    console.log('Se seteo nueva data de backup');

  }

  private _set(patch: Partial<SearchReport>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }
  private _setPath(patch: Partial<SearchReport>) {
    Object.assign(this._state, patch);
  }
  private _setData(data: any) {
    this._backUpData$.next(data);
    this.backUpData = data;
    console.log('Se seteo nueva data de backup');
    this._search$.next();
  }
  private _setLoading(value: boolean) {
    this._loading$.next(value);
  }
  private _setType(type: string) {
    this._type$.next(type);
  }

  private _setStatus(status: string) {
    this._hasStatus$.next(status);
    this._search$.next();
  }

  private _setLocation(location: any | number) {
    this._location$.next(location);
    this._state.searchLocation = location;
  }
  private _setAvailability(availability: boolean) {
    console.log('EJecutando setAvailability => ', availability);
    this._hasAvailability$.next(availability);
    this._search$.next();
  }
  private _setDonation(value: boolean) {
    console.log('EJecutando setDonation => ', value);
    this._hasDonation$.next(value);
    this._search$.next();
  }

  public resetForm(destroy?:boolean) {
    this._state.from = '';
    this._state.to = '';
    this._state.searchTerm = '';
    this._state.alertStatus = 'Activa';
    this._state.alertType = '';
    if(destroy){
      this._state.searchType = 'table';
      this._backUpData$.next([]);
      this.backUpData = [];
    }
    else{
      this._backUpData$.next(this.backUpData);
    }
    this._state.searchPath = this.path;
    this._setLocation(this.currentUser.estates.locationID);
    this._search$.next();

  }


  private matches(term: string, pipe: PipeTransform, data: any) {
    var dataSearch = {};
    if (this.currentRoute === 'stock'){
      dataSearch =
        data.name?.toLowerCase().includes(term.toLowerCase()) ||
        data.id?.toLowerCase().includes(term.toLowerCase()) ||
        pipe.transform(data.quantity)?.includes(term) ||
        data.locationCityName?.toLowerCase().includes(term.toLowerCase()) ||
        data.estates.address?.toLowerCase().includes(term.toLowerCase()) ||
        data.estates.estateTypes?.toLowerCase().includes(term.toLowerCase());
    }
    if(this.currentRoute === 'solicitudes'){
      dataSearch = data.createdByEmployee?.toLowerCase().includes(term)
      || data.condition?.toLowerCase().includes(term)
      || data.typeEmergencyDisasterName?.toLowerCase().includes(term)
      || data.locationMunicipalityName?.toLowerCase().includes(term)
      || data.locationDepartmentName?.toLowerCase().includes(term)
      || pipe.transform(data.id)?.includes(term);
    }
    if(this.currentRoute === 'emergencias'){
      dataSearch = data.alertName?.toLowerCase().includes(term)
                  || data.city?.toLowerCase().includes(term)
                  || data.state?.toLowerCase().includes(term)
                  || data.type?.toLowerCase().includes(term)
                  || pipe.transform(data.emergencyDisasterID)?.includes(term)
                  || data.employeeName?.toLowerCase().includes(term);
    }   
    return dataSearch
  }


  private structuredDate(object: any, path: string) {
    var data = {};

    //Estructuraciòn de datos en el caso de dashboard (multiples reportes)
    if (Array.isArray(path) && !(path.includes('victims') || path.includes('recursos'))) {
      path.forEach((p) => {
        //Reduce en el caso de que sea deep object, solamente 1 nivel.
        if (p.includes('.')) {
          let subStr = p.split('.');
          let map = [
            ...object
              .reduce((mp, o) => {
                  if (!mp.has(o[subStr[0]][subStr[1]]))
                  mp.set(o[subStr[0]][subStr[1]], {
                    name: name(p, o[subStr[0]][subStr[1]]),
                    value: 0,
                    path : [subStr[1]],
                  });
                p.includes('name')
                  ? (mp.get(o.name).value += o.quantity)
                  : mp.get(o[subStr[0]][subStr[1]]).value++;

                return mp;
              }, new Map())
              .values(),
          ];
          data[subStr[1]] = map;
          //Reduce en el caso de que sea objeto simple
        }  else {
          let map = [
            ...object
              .reduce((mp, o) => {

                if(Array.isArray(o[p])){
                  mp = this.keyStructured(o[p]);
                }
                else {
                  if (!mp.has(o[p]))
                  mp.set(o[p], { name: name(p, o[p]), value: 0, path: p });
                p.includes('name')
                  ? (mp.get(o.name).value += o.quantity)
                  : mp.get(o[p]).value++;
                }
                return mp;
              }, new Map())
              .values(),
          ];
          data[p] = map;
        }
      });
      //Estructuraciòn de datos para un reporte cambiando key => value.
    } else if (path.includes('victims') || path.includes('recursos')) {
      if (object.length) {
        var arrayKeys = object.length
          ? Object.keys(object[0][path])
          : Object.keys(object[path]);
        arrayKeys = arrayKeys.filter((x) => x != 'id');
      }
      data[path] = [
        ...object
          .reduce((mp, o) => {
            arrayKeys.forEach((key) => {
              if (!mp.has(key)) mp.set(key, { name: key, value: 0 ,path: path});
              mp.get(key).value += o[path][key];
            });
            return mp;
          }, new Map())
          .values(),
      ];
      //Estructuraciòn normal.
    } else {
      data[path] = [
        ...object
          .reduce((mp, o) => {
            if (!mp.has(o[path]))
              mp.set(o[path], { name: name(path, o[path]), value: 0, path: path });
            path.includes('name')
              ? (mp.get(o.name).value += o.quantity)
              : mp.get(o[path]).value++;
            return mp;
          }, new Map())
          .values(),
      ];

    }
    return data;
  }

  keyStructured(object: any):any{
    var data = {};

      var arrayKeys = object.length
        ? Object.keys(object[0])
        : Object.keys(object);


      arrayKeys = arrayKeys.filter((x) => x != 'id' && x != 'fK_Resource_RequestID');

    return data = [
      ...object
        .reduce((mp, o) => {
          arrayKeys.forEach((key) => {
            if (!mp.has(key)) mp.set(key, { name: key, value: 0});
            mp.get(key).value += o[key] ? o[key].quantity : 0;
          });
          return mp;
        }, new Map()).values()
    ];
  }


  private _search(): Observable<SearchResult> {
    const {alertType,alertStatus, searchType, searchPath, searchTerm, searchLocation, from, to } =
      this._state;
    var originalData: any;
    var total: number = 0;

    // 1. filtrado por disponibilidad
    if (this._hasStatus$.value) {
      originalData = this._backUpData$.value.filter(
        (x) => x.state === this._hasStatus$.value
      );
    }

    // 2. filtrado por disponibilidad
    if (this._hasAvailability$.value) {
      let d = originalData ? originalData : this._backUpData$.value;

      originalData = d.filter((x) => x.availability !== this._hasAvailability$.value);
    }

    // 3. filtrado por donación

    if (this._hasDonation$.value) {
      let d = originalData ? originalData : this._backUpData$.value;
      originalData = d.filter((x) => x.donation === this._hasDonation$.value);
    }
    originalData = originalData ? originalData : this._backUpData$.value;

    // 4. filtrado por fecha.
    originalData =
      from || to
        ? originalData.filter((data) => formateDate(data[this.datePath], from, to))
        : originalData;
    // 5. filtrado por busqueda.
    originalData = originalData.filter(data => this.matches(searchTerm, this.pipe, data));

    // 5. filtrado por tipo alerta.
    if(alertStatus && this.currentRoute === 'emergencias'){
      originalData = originalData.filter(data => data.state == alertStatus);
    }

    if(alertType){
      originalData = this.currentRoute === 'emergencias' 
      ? originalData.filter(data => data.type === alertType)
      :originalData.filter(data => data.typeEmergencyDisasterName === alertType);
    }

    // 6. Estructuración de datos.
  const data = this.structuredDate(originalData, searchPath);
    console.log('Data del search => ', data);
    // 7. Sumatoria total de valores.
    Array.isArray(data)
      ? data.forEach((element) => (total += element.value))
      : (total = 0);

    return of({
      originalData,
      data,
      total,
      searchType,
      searchLocation,
      searchPath,
      searchTerm,
      from,
      to,
      alertStatus,
      alertType
    });
  }
}
