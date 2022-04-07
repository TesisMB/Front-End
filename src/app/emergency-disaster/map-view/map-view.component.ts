import { MapService } from './../map.service';
import { PlacesService } from './../places.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {Map, Popup, Marker} from 'mapbox-gl';

@Component({
  selector: 'map-view',
  templateUrl: './map-view.component.html',
  styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit, AfterViewInit {

  @ViewChild ('mapDiv')
  mapDivElement!: ElementRef;
  constructor(private placesService: PlacesService,
              private mapService: MapService) { }


  ngAfterViewInit(): void {

    if(!this.placesService.userLocation) throw Error('No hay placesServices.userLocation');
    

    const map = new Map({
      container: this.mapDivElement.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 14 // starting zoom
  });

  const popUp = new Popup()
        .setHTML(`
          <h6>Aqui estoy</h6>
          <span>Estoy en este lugar del mundo</span>
        `);

  new Marker({color: 'red'})
  .setLngLat(this.placesService.userLocation)
  .setPopup(popUp)

  .addTo(map);

  this.mapService.setMap(map);
  }


  ngOnInit(): void {
    console.log(this.placesService.userLocation);
  }



}
