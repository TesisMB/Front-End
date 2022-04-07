import { map } from 'rxjs/operators';
import { Directions, Route } from './../models/directions';
import { DirectionsApiClient } from './directionsApiClient';
import { Feature } from './../models/places';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  private map?: Map;
  private markers: Marker[] = [];
 
  constructor(private directionsApi: DirectionsApiClient) { }
  
  get isMapReady(){
    return !!this.map;
  }


  setMap(map: Map){
    this.map = map;
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


    console.log("Lugares!!!!!", places);
  
    this.markers.forEach(marker => marker.remove());
    
    let newMarkers = [];
    
    for (const place of places) {
      const [lng, lat] = place.center;
      
      const popUp  = new Popup()
      .setHTML(`
      <h6>${place.text}</h6>
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
