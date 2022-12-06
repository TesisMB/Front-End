import { MapService } from './../map.service';
import { PlacesService } from './../places.service';
import { Component, OnInit } from '@angular/core';
import { Reverse } from 'src/app/models/reverse';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {

  private debounceTimer ?: NodeJS.Timeout;
  place: any;
  LocationObservable: Observable<Reverse>;
  subscriber1: Subscription;
  location: any;

  constructor(private mapService: MapService,
    private placesService: PlacesService) { }


  ngOnInit(): void {
    this.subscriber1 = this.mapService.reverseSubject$.subscribe(resp => {
      if(resp){

        this.place = resp.features[0].place_name;
        console.log('ACA ESTO DESDE SEARCH BAR => ', resp);
      }
    },
    err =>{
      console.log(err);
    });
  }

  getMensaje2(e){
    this.place = e;
    console.log("vacio!!! ", e);
    this.mapService.deletePlace();
    //this.mapService.deletePlaces();
  }

  getMensaje(e){
    this.place = e.place_name;
    console.log("Place!!! ", e);
  }

  onQueryChange(query: string = ''){

    if(this.debounceTimer) clearTimeout(this.debounceTimer);

    this.debounceTimer = setTimeout(() => {
      this.placesService.getPlacesByQuery(query);
    }, 350);



  }


  goToMyLocation(){

    if(!this.placesService.isUserLocationReady) throw Error('No hay ubicación de usuario');
    if(!this.mapService.isMapReady) throw Error('No hay mapa disponible');

    this.mapService.crearMarcador(this.placesService.userLocation[0], this.placesService.userLocation[1]);
    //  this.mapService.flyTo(this.placeService.userLocation);
  }
}
