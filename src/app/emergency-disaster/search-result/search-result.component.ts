import { MapService } from './../map.service';
import { Feature } from './../../models/places';
import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../places.service';

@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  public selectedId: string = '';

  constructor(private placesService: PlacesService,
              private mapService: MapService) { }

  ngOnInit(): void {
  }


  get isLoadingPlaces(): boolean{
    return this.placesService.isLoadingPlaces;
  }

  get places(): Feature[]{
    return this.placesService.places;
  }


  getLugar(place: Feature){
    const lugar = this.places.filter(a => a.id === place.id);
    this.placesService.setPlace(place);
  }


  flyTo(place: Feature){
    this.selectedId = place.id;
    const [lng, lat] = place.center;

    this.mapService.flyTo([lng, lat]);
  }

  getDirections(place: Feature){

    if(!this.placesService.userLocation) throw Error('No hay userLocation');

    this.placesService.deletePlaces();
    
    const start = this.placesService.userLocation;
    const end = place.center as [number, number];

    this.mapService.getRouterBetweenPoint(
      start, end
    )
  }
}
