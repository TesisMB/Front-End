import { Router } from '@angular/router';
import { EmergencyDisaster } from './../../models/emergencyDisaster';
import { SelectTypesEmergencyDisasterService } from './../select-types-emergency-disaster.service';
import { TypesEmergencyDisaster } from './../../models/typeEmergencyDisaster';
import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import {Observable, pipe, Subscription} from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
import { EmergencyDisasterService } from '../emergency-disaster.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services';
import { ReportService } from 'src/app/services/_report.service/report.service';


@Component({
  selector: 'emergency-disaster',
  templateUrl: './emergency-disaster.component.html',
  styleUrls: ['./emergency-disaster.component.css']
})
export class EmergencyDisasterComponent implements OnInit, OnDestroy {

  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  emergencyDisaster: EmergencyDisaster [];
  selected: string;
  isActive: boolean = false;
  typeEmergencyDisaster: TypesEmergencyDisaster[];
  arraytypeEmergencyDisaster = [];
  id: number;
  status: boolean;
  handleSU: Subscription;
  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  isLoading: Observable<boolean>;
  form: FormGroup;
  handleAlerts: Subscription;
  handleTypes: Subscription;



  constructor(
    public service : SelectTypesEmergencyDisasterService,
    private router: Router,
    private fb: FormBuilder,
    public reportService : ReportService
    ) {

      this.form = this.fb.group({
        startDate: ['', Validators.required],
        endDate: ['', Validators.required]
      });
      this.service.loading = true;
      this.isLoading = this.service.loading$;
  }



  ngOnInit(): void {
    this.getEmergencyDisaster();
    
  }
  
  getEmergencyDisaster() {
    this.handleAlerts = this.service.getAllWithoutFilter()
    .subscribe(data => {
      this.emergencyDisaster = data;
      this.getAlertsFromTable();
          console.log('EmergencyDisaster - ListAll => ', data);
      }, error => {
        console.log('Error', error);
      });
  }
private getAlertsFromTable(){
  this.handleSU = this.reportService.originalData$.subscribe(
    alerts => {
      this.service.uploadTable(alerts);
      
    },
    error => {
      console.error(error);
    }
  )
}



  // setEmergenciesDisaster(emergencyDisaster: EmergencyDisaster[]){
  //   this.service.uploadTable(emergencyDisaster);
  // }

  // selectTypes(id: number){
  //   console.log("data => ", id);
  //   this.service.setTypes(id);
  //   /*this.service.TypesEvent.emit(id); */
  // }


/*   slideToogle(select : string){
    console.log("Checked: ", select);
    this.service.setStatus(event.checked);

  } */


  // getcheckStatus(event) {
  //   this.service.setStatus(event.checked);
  // }

  currentDate(event){
    const value = event.value;

    console.log(typeof value);
  }


  create(){
    this.router.navigate(['emergencias/agregar-emergencia-desastre']);
  }

  ngOnDestroy(): void {
    this.reportService.resetForm(true);
    // this.handleTypes.unsubscribe();
    this.handleAlerts.unsubscribe();
    if(this.handleSU){
      this.handleSU.unsubscribe();
    }
  }
  searchTerm(event){
    console.log('Llego el evento! => ',event);
    this.service.searchTerm = event;
  }

}
