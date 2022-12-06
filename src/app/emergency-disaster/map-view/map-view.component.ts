import { MapService } from './../map.service';
import { PlacesService } from './../places.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import {Map, Popup, Marker} from 'mapbox-gl';
import mapboxgl from 'mapbox-gl';
//import { MapsAPILoader } from '@agm/core';
import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';

const geoJSON = {
  "type": "geojson",
  "data": {
    "type": "Feature",
    "geometry": {
        "type": "Point",
        "coordinates": []
    },
    "properties": {
        "title": "Mapbox DC",
        "marker-symbol": "monument"
    }
}
};

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, AfterViewInit {
  title: string = 'AGM project';
  lat: number;
  lng: number;
  zoom: number;
  address: string;
  private geoCoder;
  source = geoJSON;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  map: Map;
  @ViewChild ('mapDiv')
  mapDivElement!: ElementRef;
  private debounceTimer ?: NodeJS.Timeout;

  constructor(private placesService: PlacesService,
              private mapService: MapService,

){}              //private mapsAPILoader: MapsAPILoader,
              //private ngZone: NgZone) { }


  ngAfterViewInit(): void {

    if(!this.placesService.userLocation) throw Error('No hay placesServices.userLocation');


    this.map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 14 // starting zoom
  });

  // const popUp = new Popup()
  //       .setHTML(`
  //         <h5>Ubicaciòn actual</h5>
  //       `);

  // new Marker({color: 'red'})
  // .setLngLat(this.placesService.userLocation)
  // .setPopup(popUp)

  // .addTo(this.map);


  this.map.addControl(new mapboxgl.FullscreenControl());

  this.map.addControl(new mapboxgl.NavigationControl());



    // Add the control to the map.
  //   map.addControl(
  //     new MapboxGeocoder({
  //         accessToken: mapboxgl.accessToken,
  //         mapboxgl: mapboxgl,

  //         marker: {
  //           color: 'orange'
  //         },
  //     }
  //     )
  // );



//   map.on('load', () => {
//     map.addLayer({
//         id: 'terrain-data',
//         type: 'line',
//         source: {
//             type: 'vector',
//             url: 'mapbox://mapbox.mapbox-terrain-v2'
//         },
//         'source-layer': 'contour'
//     });
// });

  // map.addControl(new mapboxgl.GeolocateControl({
  //   showUserLocation: true,
  //   trackUserLocation: true
  // }));


  this.mapService.setMap(this.map);
  }

  ngOnInit(): void {
  // this.lat = this.placesService.userLocation[1];
  // this.lng = this.placesService.userLocation[0];
  // this.zoom = 15;
   console.log(this.placesService.userLocation);
  }

  //    //load Places Autocomplete
  //   this.mapsAPILoader.load().then(() => {
  //     this.setCurrentLocation();
  //     this.geoCoder = new google.maps.Geocoder;

  //     let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
  //     autocomplete.addListener("place_changed", () => {
  //       this.ngZone.run(() => {
  //         //get the place result
  //         let place: google.maps.places.PlaceResult = autocomplete.getPlace();

  //         //verify result
  //         if (place.geometry === undefined || place.geometry === null) {
  //           return;
  //         }

  //         //set latitude, longitude and zoom
  //         this.latitude = place.geometry.location.lat();
  //         this.longitude = place.geometry.location.lng();
  //         this.zoom = 12;
  //       });
  //     });
  //   });


  //   // this.lat = this.placesService.userLocation[1];
  //   // this.lng = this.placesService.userLocation[0];
  //   // this.zoom = 15;
  //   // console.log(this.placesService.userLocation);
  // }

  // private setCurrentLocation(){
  //   if ('geolocation' in navigator) {
  //     navigator.geolocation.getCurrentPosition((position) => {
  //       this.latitude = position.coords.latitude;
  //       this.longitude = position.coords.longitude;
  //       this.zoom = 8;
  //       this.getAddress(this.latitude, this.longitude);
  //     });
  //   }
  // }

  // onQueryChange(query: string = ''){
  //   if(this.debounceTimer) clearTimeout(this.debounceTimer);

  //   this.debounceTimer = setTimeout(() => {
  //     this.placesService.getPlacesByQuery(query);
  //   }, 350);



  // }

  // markerDragEnd($event: any) {
  //   console.log($event);
  //   this.latitude = $event.coords.lat;
  //   this.longitude = $event.coords.lng;
  //   this.getAddress(this.latitude, this.longitude);
  // }

  // getAddress(latitude, longitude) {
  //   this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
  //     console.log(results);
  //     console.log(status);
  //     if (status === 'OK') {
  //       if (results[0]) {
  //         this.zoom = 12;
  //         this.address = results[0].formatted_address;
  //       } else {
  //         window.alert('No results found');
  //       }
  //     } else {
  //       window.alert('Geocoder failed due to: ' + status);
  //     }

  //   });

  // }


  // crearMarcador(lng: number, lat: number){

  //   const marker = new mapboxgl.Marker({
  //     draggable: true
  //     })
  //     .setLngLat([lng, lat])
  //     .addTo(this.map);
  // }


}
