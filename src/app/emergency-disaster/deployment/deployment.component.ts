import { ActivatedRoute } from '@angular/router';
import { EmergencyDisasterService } from './../emergency-disaster.service';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import {FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import {Map, Popup, Marker} from 'mapbox-gl';

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
  selector: 'deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.css']
})
export class DeploymentComponent implements OnInit{
  // @ViewChild('mapDiv')
  // mapDivElement!: ElementRef;
 map: Map;
emergencyDisaster: EmergencyDisaster;
firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  id: number;
  users = [];
  materials = [];
  medicines = [];
  vehicles = [];
  resourcesRequest = [];
  loading = false;
  coords: number[] = null;
  source = geoJSON;
  constructor(
    private location: Location,
    private emergencyDisasterService: EmergencyDisasterService,
    private route: ActivatedRoute
    ) {  }

   get isLocationReady(){
    return this.emergencyDisaster !== null;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.getEmergencyById();
  }
  onLoad($event): void {
    this.map = $event;
    this.map.on('zoomend', (event) => {
    const newZoom = this.map.getZoom();
    });
  }

  onBack() {
    this.location.back();
  }

  getEmergencyById(){
    this.emergencyDisasterService.getByIdWithoutFilter(this.id, true)
    .subscribe
    (data =>{
      this.emergencyDisaster = data;
      console.log("Info alerta", data);

    this.source.data.geometry.coordinates = [this.emergencyDisaster.locationsEmergenciesDisasters.locationlongitude, this.emergencyDisaster.locationsEmergenciesDisasters.locationlatitude];

      if(this.emergencyDisaster.chatRooms != null){
        this.emergencyDisaster.usersChatRooms.forEach(element => {
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

      this.resourcesRequest = this.emergencyDisaster.resources_Requests.filter(a => a.condition === 'Aceptada');

      console.log('Recursos', this.resourcesRequest);

      this.resourcesRequest.forEach(element => {
          this.materials = element.resources_RequestResources_Materials_Medicines_Vehicles.filter(a => a.materials);
          this.medicines = element.resources_RequestResources_Materials_Medicines_Vehicles.filter(a => a.medicines);
          this.vehicles = element.resources_RequestResources_Materials_Medicines_Vehicles.filter(a => a.vehicles);
      });

      console.log("Materiales =>", this.materials);
      console.log("Medicines =>", this.medicines);
      console.log("Vehicles =>", this.vehicles);


      console.log("Emergencia ID" ,data.victims);

    }, error =>{
      console.log(error);
    })
  }

  generatePDF(id: number){
    this.loading = true;
    //let fileName = `${this.user.users.persons.firstName} ${this.user.users.persons.lastName}`;
      //let fileName = `${this.currentUser.persons.firstName} ${this.currentUser.persons.lastName}`;
      let fileName = 'Emergencia';
      this.emergencyDisasterService.generatePDFEmergency(id).subscribe(res => {
        const file = new Blob([<any>res], {type: 'application/pdf'});
      //  saveAs(file, fileName);
        const fileURL = window.URL.createObjectURL(file);
        window.open(fileURL, fileName);
        this.loading = false;

      });
    }


}
