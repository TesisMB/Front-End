import { map } from 'rxjs/operators';
import { PlacesService } from './../places.service';
import { MapService } from './../map.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Feature } from 'src/app/models/places';

@Component({
  selector: 'btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrls: ['./btn-my-location.component.css']
})
export class BtnMyLocationComponent implements OnInit {
  @Output() eventoLocation = new EventEmitter<string>();

  constructor(private mapService: MapService,
              private placeService: PlacesService) { }

  ngOnInit(): void {
  }


  goToMyLocation(){
    this.eventoLocation.emit("");

    if(!this.placeService.isUserLocationReady) throw Error('No hay ubicación de usuario');
    if(!this.mapService.isMapReady) throw Error('No hay mapa disponible');

    //this.mapService.crearMarcador(this.placeService.userLocation[0], this.placeService.userLocation[1]);
  //  this.mapService.flyTo(this.placeService.userLocation);
  }
}
