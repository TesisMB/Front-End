import { AuthenticationService } from './../../services/_authentication/authentication.service';
import { UserService } from './../../users/user.service';
import { PlacesService } from './../places.service';
import { Alerts } from './../../models/alerts';
import { Alert } from './../../models/alert';
import { EmergencyDisasterService } from './../emergency-disaster.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TypesEmergencyDisaster } from 'src/app/models/typeEmergencyDisaster';
import { SelectTypesEmergencyDisasterService } from '../select-types-emergency-disaster.service';
import { Observable } from 'rxjs';
import { Feature } from 'src/app/models/places';
import { Ubicacion } from 'src/app/models/Parametros';
import { Employee } from 'src/app/models';
import { MatStepper } from '@angular/material/stepper';
import { AlertService } from 'src/app/services';

@Component({
  selector: 'add-emergency-disaster',
  templateUrl: './add-emergency-disaster.component.html',
  styleUrls: ['./add-emergency-disaster.component.css']
})
export class AddEmergencyDisasterComponent implements OnInit, OnDestroy {
  @ViewChild('stepper',{read:MatStepper}) stepper:MatStepper;

  arraytypeEmergencyDisaster = [];
  typeEmergencyDisaster: TypesEmergencyDisaster[];
  location: boolean = false;
  addEmergencyDisaster: FormGroup;
  alerts: Alerts[];
  placeObservable: Feature;
  currentPlaceHandler: any;
  coordinates: Ubicacion;
  handler: any;
  currentUser: number;
  user: Employee [];


  constructor(    private router: Router,
    private selectTypesEmergencyDisasterService : SelectTypesEmergencyDisasterService,
    private emergencyDisasterService: EmergencyDisasterService,
    private fb: FormBuilder,
    private placesService: PlacesService,
    private authenticationService: AuthenticationService,
    private userService : UserService,
    private alertService: AlertService
    ) {

      this.addEmergencyDisaster = this.fb.group({
        FK_TypeEmergencyID: ["", Validators.required],
        FK_AlertID: ["", Validators.required],
        Fk_EmplooyeeID: ["", Validators.required],
        emergencyDisasterInstruction: [" ", Validators.required],
        locations: this.fb.group({
          locationCityName: [],
          locationDepartmentName: [],
          locationMunicipalityName: [],
          locationLongitude: [],
          LocationLatitude: []
        }),
        chatRooms: this.fb.group({
          FK_TypeChatRoomID: [1]
        }),
        victims: this.fb.group({
          numberDeaths: [0, [Validators.required, Validators.min(0)]],
          numberAffected: [0, [Validators.required, Validators.min(0)]],
          numberFamiliesAffected: [0, [Validators.required, Validators.min(0)]],
          materialsDamage: [0,  [Validators.required, Validators.min(0)]],
          affectedLocalities: [0,  [Validators.required, Validators.min(0)]],
          evacuatedPeople: [0,  [Validators.required, Validators.min(0)]],
          affectedNeighborhoods: [0,  [Validators.required, Validators.min(0)]],
          assistedPeople: [0,  [Validators.required, Validators.min(0)]],
          recoveryPeople: [0,  [Validators.required,Validators.min(0)]],
        })
      })

     }

     get formEmergency () { return this.addEmergencyDisaster;}

     get formVictims() { return this.addEmergencyDisaster.get('victims');}


  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(data => {
      this.currentUser = data.userID;
      console.log("Data", data);
    }, error => {
      console.log("Error", error);
    })



    this.alerts = this.emergencyDisasterService.ListarAlertas;
    this.getTypeEmergencyDisaster();
    this.getUser();
  }


  getUser(){
    this.userService.getAll().subscribe(data => {
      this.user = data;

      this.user = this.user.filter(a => a.users.roleName == "Coordinador de Emergencias y Desastres");
    }, error =>{
      console.log(error);
    })
  }

  addEmergencyDisasterFunction(){

    this.currentPlaceHandler = this.placesService.placeSubject$.subscribe(resp => {
      this.placeObservable = resp;
      console.log(this.placeObservable);

      this.router
    }, err => {
      console.log(err);
    });


  
   this.handler = this.placesService.getLocation(this.placeObservable.center[1], this.placeObservable.center[0]).subscribe(resp =>{
     this.coordinates = resp.ubicacion;
    }, error=>{
      console.log("Error", error);
    });

  
    console.log(this.coordinates);

    this.addEmergencyDisaster.get('locations.locationCityName').patchValue(this.coordinates.municipio.nombre);
    this.addEmergencyDisaster.get('locations.locationDepartmentName').patchValue(this.coordinates.departamento.nombre);
    this.addEmergencyDisaster.get('locations.locationMunicipalityName').patchValue(this.coordinates.municipio.nombre);
    this.addEmergencyDisaster.get('locations.locationLongitude').patchValue(this.placeObservable.center[0]);
    this.addEmergencyDisaster.get('locations.LocationLatitude').patchValue(this.placeObservable.center[1]);



    const emergency = this.addEmergencyDisaster.value;
    console.log('Formulario =>', emergency);

    this.emergencyDisasterService.register(emergency).subscribe( () =>{
      this.alertService.success('Registro exitoso :)', { autoClose: true });
      // this.router.navigate(['/'], { relativeTo: this.route });
      //this.tableService._setEmployee();
        this.stepper.reset();
    }, error =>{
      console.log("Error en el formulario!!!", error);
    }) 
  }




  getTypeEmergencyDisaster(){
    this.selectTypesEmergencyDisasterService.getAll()
    .pipe(
      map((x) =>{
        x.forEach(item =>{
          const types = {
            id: item.typeEmergencyDisasterID,
            name: item.typeEmergencyDisasterName
          };
          this.arraytypeEmergencyDisaster.push(types);
        })

          console.log('arraytypeEmergencyDisaster []', this.arraytypeEmergencyDisaster);
          
          return x;
      }))
    .subscribe(data =>{
      this.typeEmergencyDisaster = data;
      console.log('typeEmergencyDisaster => ', this.typeEmergencyDisaster);
    }, error =>{
      console.log("Error =>", error);
    })
  }

  mapa(){
  
    /* this.router.navigate(['emergencias/ubicacion']); */
  }

 
  ngOnDestroy(): void {
   /*  this.handler.unsubscribe();
    this.currentPlaceHandler.unsubscribe(); */
  }

}
