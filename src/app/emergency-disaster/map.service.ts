import { environment } from './../../environments/environment';
import { map } from 'rxjs/operators';
import { Directions, Route } from './../models/directions';
import { DirectionsApiClient } from './directionsApiClient';
import { Feature } from './../models/places';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Injectable } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { HttpClient } from '@angular/common/http';
import { Reverse } from '../models/reverse';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map?: Map;
  private markers: Marker[] = [];
  private places : Feature [] = [];
  private _reverseSubject: BehaviorSubject<Reverse> = new BehaviorSubject<Reverse>(null);
  private reverse: Reverse;
  private marker = new mapboxgl.Marker;
  constructor(private directionsApi: DirectionsApiClient,
               protected http: HttpClient,
    ) { }

  get isMapReady(){
    return !!this.map;
  }

  get reverseSubject$(){
    return this._reverseSubject.asObservable();
  }

  setPlace(place: Reverse){
      this._reverseSubject.next(place);
      console.log("Observable lugares !! ", place);
  }

  setMap(map: Map){
    this.map = map;
  }

  //https://api.mapbox.com/geocoding/v5/mapbox.places/-64.208229,-31.409489.json?types=poi&access_token=pk.eyJ1IjoieW9lbHNvbGNhIiwiYSI6ImNrenpxZ2Z6bzBjcGgzY3F4NnJwYjJoODEifQ.tB-AizTwtOQLC3BA_5FiMw

  getLocation(lat: number, lon: number){
    return this.http.get<any>(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lon},${lat}.json?types=poi&access_token=${environment.key}`);
}



  flyTo(coord: LngLatLike){
    if(!this.isMapReady) throw Error('El mapa no esta inicializado');

    this.map.flyTo({
      zoom: 14,
      center: coord
    });
  }

  createMarkersFromPlaces(places: Feature[], userLocation: [number, number]){
    if(!this.map) throw Error('Mapa no inicializado');


    this.places = places;
    console.log("Lugares!!!!!", this.places);


    this.markers.forEach(marker => marker.remove());

    let newMarkers = [];

    for (const place of places) {
      const [lng, lat] = place.center;
      // <h6>${place.text}</h6>

      const popUp  = new Popup()
      .setHTML(`
      <span>${place.place_name}</span>
      `);

      const newMarker = new Marker()
      .setLngLat([lng, lat])
      .setPopup(popUp)
      .addTo(this.map);



      newMarkers.push(newMarker);

    }

    this.markers = newMarkers;

    if(places.length === 0)
        //clear polilyne
        if(this.map.getLayer('RouteString')){
          this.map.removeLayer('RouteString');
          this.map.removeSource('RouteString');
          };

    //limited del mapa

    const bounds = new LngLatBounds();

    newMarkers.forEach(marker =>
      bounds.extend(marker.getLngLat()));

      bounds.extend(userLocation);

    this.map.fitBounds(bounds,{
      padding: 200
    });

  }

  createMarkerFromPlace(place: Feature){
        this.markers.forEach(marker => marker.remove());
        this.createMarker(place);
  }

  crearMarcador(lng: number, lat: number){
    // this.deletePlaces()
    // this.deletePlace()

    this.marker = new mapboxgl.Marker({
      draggable: true
      })
      .setLngLat([lng, lat])
      .addTo(this.map);

      this.marker.on('drag', () =>{

        const mark = this.marker.getLngLat();
        console.log(mark);

        this.getLocation(mark.lat, mark.lng).subscribe(resp =>{
          this.setPlace(resp);
           console.log("getLocation ", resp);
        });
      });
  }


  deletePlaces(){
    this.markers.forEach(marker => marker.remove());
    console.log("Eliminadossss!!")
  }

  deletePlace(){
    console.log("Eliminado!!")
    this.marker.remove();
  }




  createMarker(place: Feature){
    let newMarkers = [];

      const [lng, lat] = place.center;
      // <h6>${place.text}</h6>

      const popUp  = new Popup()
      .setHTML(`
      <span>${place.place_name}</span>
      `);

      const newMarker = new Marker()
      .setLngLat([lng, lat])
      .setPopup(popUp)
      .addTo(this.map);


      newMarkers.push(newMarker);
    this.markers = newMarkers;
  }



  getRouterBetweenPoint(start: [number, number], end: [number, number]){
    this.directionsApi.get<Directions>
    (`/${start.join(',')};
      ${end.join(',')}`)
      .subscribe(resp =>{
        this.drawPolyLine(resp.routes[0]);
      });
  }

  private drawPolyLine(route: Route){
    console.log({
      Kms: route.distance / 1000,
      duration: Math.floor(route.duration / 60)
    });

    if(!this.map) throw Error('Mapa no inicializado');


    const coords = route.geometry.coordinates;


    const bounds = new LngLatBounds();

/*     coords.forEach((coord: [number, number] )=> bounds.extend(coord));
 */
    coords.forEach(([lng, lat] )=> bounds.extend([lng, lat]));

    this.map?.fitBounds(bounds, {
      padding: 200
    });


    // Polyline

    const sourceData: AnySourceData ={
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties:{},
          geometry: {
            type:'LineString',
            coordinates: coords
          }
        }
        ]
      }
    }


    if(this.map.getLayer('RouteString')){
      this.map.removeLayer('RouteString');
      this.map.removeSource('RouteString');
    }

    this.map.addSource('RouteString', sourceData);



    this.map.addLayer({
      id: 'RouteString',
      type: 'line',
      source: 'RouteString',
      layout: {
        'line-cap': 'round',
        'line-join': 'round'
      },
      paint:{
        'line-color': 'black',
        'line-width': 3
      }
    });
  }
}
