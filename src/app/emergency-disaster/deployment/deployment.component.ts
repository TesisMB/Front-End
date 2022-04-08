import { Router, ActivatedRoute } from '@angular/router';
import { EmergencyDisasterService } from './../emergency-disaster.service';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { Component, Input, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as L from  'Leaflet';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { environment } from 'src/environments/environment';


@Component({
  selector: 'deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.css']
})
export class DeploymentComponent implements OnInit, AfterViewInit{
  @ViewChild('mapDiv')
  mapDivElement !: ElementRef;
 
emergencyDisaster: EmergencyDisaster;
/*  public dataObservable : Observable<number>;
 */
firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  id: number;
  users = [];
  materials = [];
  medicines = [];
  vehicles = [];


  constructor(private emergencyDisasterService: EmergencyDisasterService,
    private _formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
    ) {

 /*     this.dataObservable = this.emergencyDisasterService.EmergencyDisasterSubject$
     console.log("EmergencyDisaster - Observable => ", this.dataObservable); */
   }
  ngAfterViewInit(): void {
     (mapboxgl as any).accessToken = environment.key;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11', // style URL
      center: [-74.5, 40], // starting position [lng, lat]
      zoom: 9 // starting zoom
    });
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
    this.id = this.route.snapshot.params['id'];
    this.getEmergencyById();
  }



  getEmergencyById(){
    this.emergencyDisasterService.getByIdWithoutFilter(this.id)
    .subscribe
    (data =>{
      this.emergencyDisaster = data;

      if(this.emergencyDisaster.chatRooms != null){
        this.emergencyDisaster.chatRooms.usersChatRooms.forEach(element => {
          const user = {
            id: element.userID,
            legajo: element.userDni,
            roleName: element.roleName,
            name: element.name,
          }
  
          this.users.push(user);
        });
      }

      console.log("Usuarios involucrados", this.users);

      this.emergencyDisaster.resources_Requests.forEach(element => {
          this.materials = element.resources_RequestResources_Materials_Medicines_Vehicles.filter(a => a.materials);
          this.medicines = element.resources_RequestResources_Materials_Medicines_Vehicles.filter(a => a.medicines);
          this.vehicles = element.resources_RequestResources_Materials_Medicines_Vehicles.filter(a => a.vehicles);
      });

      console.log("Materiales =>", this.materials);
      console.log("Medicines =>", this.medicines);
      console.log("Vehicles =>", this.vehicles);


      console.log("Emergencia ID" ,data);
      this.initMap();
    }, error =>{
      console.log(error);
    })
  }


}
