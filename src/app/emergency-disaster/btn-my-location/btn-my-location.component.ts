import { map } from 'rxjs/operators';
import { PlacesService } from './../places.service';
import { MapService } from './../map.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent implements OnInit {

  constructor(private mapService: MapService,
              private placeService: PlacesService) { }

  ngOnInit(): void {
  }


  goToMyLocation(){

    if(!this.placeService.isUserLocationReady) throw Error('No hay ubicación de usuario');
    if(!this.mapService.isMapReady) throw Error('No hay mapa disponible');

   this.mapService.flyTo(this.placeService.userLocation);
  }
}
