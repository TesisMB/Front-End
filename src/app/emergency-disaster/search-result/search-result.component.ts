import { Reverse } from './../../models/reverse';
import { MapService } from './../map.service';
import { Feature } from './../../models/places';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PlacesService } from '../places.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit {

  @Output() evento = new EventEmitter<Feature>();
  @Output() eventoreverse = new EventEmitter<Reverse>();

  public selectedId: string = '';
  username: string = '';
  subscriber1: Subscription;
  LocationObservable: Observable<Reverse>;

  constructor(private placesService: PlacesService,
              private mapService: MapService) { }

  ngOnInit(): void {
  }


  get isLoadingPlaces(): boolean{
    return this.placesService.isLoadingPlaces;
  }

  get places(): Feature[]{
    let locations: string[]
    let locations2: string[]

    this.placesService.places.forEach(x => {
      locations = x.place_name.split(',');
    });

    return this.placesService.places;
  }


  getLugar(place: Feature){
    this.evento.emit(place);
    const lugar = this.places.filter(a => a.id === place.id);
    this.placesService.setPlace(place);
    this.flyTo(place);
  }


  flyTo(place: Feature){
    this.selectedId = place.id;
    const [lng, lat] = place.center;

    this.mapService.flyTo([lng, lat]);
    this.mapService.createMarkerFromPlace(place);
    this.getDirections(place);
  }

  getDirections(place: Feature){

    if(!this.placesService.userLocation) throw Error('No hay userLocation');

    this.placesService.deletePlaces();

    const start = this.placesService.userLocation;
    const end = place.center as [number, number];

    // this.mapService.getRouterBetweenPoint(
    //   start, end
    // )
  }
}
