import { PlacesService } from './../places.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private placesService: PlacesService) { }


  ngOnInit(): void {
  }


  get isUserLocationReady(){
    return this.placesService.isUserLocationReady;
  }







}
