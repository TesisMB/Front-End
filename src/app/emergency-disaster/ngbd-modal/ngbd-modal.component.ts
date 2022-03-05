import { EmergencyDisasterService } from './../emergency-disaster.service';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from  'Leaflet';


@Component({
  selector: 'ngbd-modal',
  templateUrl: './ngbd-modal.component.html',
  styleUrls: ['./ngbd-modal.component.css']
})
export class NgbdModalComponent implements OnInit, AfterViewInit{

@Input() emergencyDisaster: EmergencyDisaster;
/*  public dataObservable : Observable<number>;
 */
firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  private map;

  constructor(private emergencyDisasterService: EmergencyDisasterService,
    private _formBuilder: FormBuilder
    ) {

 /*     this.dataObservable = this.emergencyDisasterService.EmergencyDisasterSubject$
     console.log("EmergencyDisaster - Observable => ", this.dataObservable); */
   }
  ngAfterViewInit(): void {
    this.initMap();
  }


  initMap(){
    var map = L.map('map')
    .setView([this.emergencyDisaster.locations.locationLatitude, this.emergencyDisaster.locations.locationLongitude], 14);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoieW9lbHNvbGNhIiwiYSI6ImNrenpxZ2Z6bzBjcGgzY3F4NnJwYjJoODEifQ.tB-AizTwtOQLC3BA_5FiMw'
}).addTo(map);

var marker = L.marker([this.emergencyDisaster.locations.locationLatitude, this.emergencyDisaster.locations.locationLongitude],{
  fillColor: '#ccc'
})
.addTo(map);

var circle = L.circle([this.emergencyDisaster.locations.locationLatitude, this.emergencyDisaster.locations.locationLongitude], {
  color: 'red',
  fillColor: '#f03',
  fillOpacity: 0.3,
  radius: 800,
  stroke: false
}).addTo(map);

var popup = L.popup()
    .setLatLng([this.emergencyDisaster.locations.locationLatitude, this.emergencyDisaster.locations.locationLongitude])

    function onMapClick(e) {
      popup
          .setLatLng(e.latlng)
          .setContent("You clicked the map at " + e.latlng.toString())
          .openOn(map);
  }
  
  map.on('click', onMapClick);

  }


  ngOnInit(): void {

    
    console.log("Observable: ", this.emergencyDisasterService.EmergencyDisasterValue);
    console.log("EmergencyDisaster - Observable: ", this.emergencyDisasterService.EmergencyDisasterSubject$);
    console.log("EmergencyDisaster =>" , this.emergencyDisaster)

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
  }


}
