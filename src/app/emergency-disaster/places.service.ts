import { Reverse } from './../models/reverse';
import { MapService } from './map.service';
import { PlacesApiClient } from './placesApiClient';
import { Places, Feature } from './../models/places';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, QueryList } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private options = { headers: new HttpHeaders().set('Content-Type', 'application/json'),
  params: new HttpParams() };

  public userLocation?: [number, number];
  public isLoadingPlaces: boolean = false;
  public places: Feature[] = [];
  private _placeSubject: BehaviorSubject<Feature> = new BehaviorSubject<Feature>(null);
  private _placeSubject2: BehaviorSubject<Reverse> = new BehaviorSubject<Reverse>(null);


  get isUserLocationReady():boolean{
    return !!this.userLocation;
  }


  constructor(private placeApi: PlacesApiClient,
              private mapService: MapService,
              protected http: HttpClient,
    ) {
    console.log("Localizacion: ", this.getUserLocation());
  }



  getLocation(lat: number, lon: number){
    return this.http.get<any>(`https://apis.datos.gob.ar/georef/api/ubicacion?lat=${lat}&lon=${lon}`);
}

get alertLocation(){
  return this.userLocation;
}

set alertLocation(coords){
  this.userLocation = coords;
}

  get placeSubject$(){
    return this._placeSubject.asObservable();
  }


  setPlace(place: Feature){
    this._placeSubject.next(place);
    console.log("Lugar Observable =>", place);
    this.deletePlaces();
  }

  // setPlaceReverse(place: Reverse){
  //   this._placeSubject2.next(place);
  //   console.log("Lugar Observable =>", place);
  //   this.deletePlaces();
  // }


  public async getUserLocation() : Promise<[number, number]>{
    return new Promise((resolve, reject) =>{

      navigator.geolocation.getCurrentPosition(
          ({coords}) =>
           {
             this.userLocation = [coords.longitude, coords.latitude]
             resolve(this.userLocation);
          },
          (error) =>{
            console.log('No se pudo obtener la geolocalizacion', error);
            reject();
          }
      );

    });
  }

  getPlacesByQuery(query: string = ''){
 /*    if(query.length === 0 ){
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    } */

    if(!this.userLocation) throw Error('No hay userLocation');
    this.isLoadingPlaces = true;

    this.placeApi.get<Places>(
    `/${query}.json`, {
      params:{
        proximity: this.userLocation.join(',')
      }
    })
    .subscribe(resp =>{
      //console.log(resp.features);

      this.isLoadingPlaces = false;
      this.places = resp.features;

      this.mapService.createMarkersFromPlaces(resp.features, this.userLocation!);
    });
  }


  deletePlace(place: Feature){
    console.log("Eliminado!!")
    this.places = [place];
  }

  deletePlaces(){
    console.log("Eliminado!!")
    this.places = [];
  }
}


