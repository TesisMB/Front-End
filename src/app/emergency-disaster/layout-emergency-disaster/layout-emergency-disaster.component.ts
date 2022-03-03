import { SelectTypesEmergencyDisasterService } from './../select-types-emergency-disaster.service';
import { TypesEmergencyDisaster } from './../../models/typeEmergencyDisaster';
import { Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import {pipe} from 'rxjs';

@Component({
  selector: 'layout-emergency-disaster',
  templateUrl: './layout-emergency-disaster.component.html',
  styleUrls: ['./layout-emergency-disaster.component.css']
})
export class LayoutEmergencyDisasterComponent implements OnInit, OnDestroy {

  emergencyDisaster: EmergencyDisaster [] = [];
  selected: string;
  isActive: boolean = false;
  emergencyDisasterClone: EmergencyDisaster [];
  typeEmergencyDisaster: TypesEmergencyDisaster[];
  arraytypeEmergencyDisaster = [];
  id: number;
  status: boolean;


  constructor(
    private selectTypesEmergencyDisasterService : SelectTypesEmergencyDisasterService
    ) {
  }

  
  
  ngOnInit(): void {
    this.getTypeEmergencyDisaster();
    
    this.selectTypesEmergencyDisasterService.selectTypesEmergencyDisaster$.subscribe(
      (idTypes: number) => this.id = idTypes);
      

      this.selectTypesEmergencyDisasterService.statusTypesEmergencyDisaster$.subscribe(
        (idTypes: boolean) => this.status = idTypes);

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
          
          //console.log('arraytypeEmergencyDisaster []', this.arraytypeEmergencyDisaster);
          
          return x;
      }))
    .subscribe(data =>{
      this.typeEmergencyDisaster = data;
      console.log('typeEmergencyDisaster => ', this.emergencyDisaster);
    }, error =>{
      console.log("Error =>", error);
    })
  }

  selectTypes(id: number){
    console.log("data => ", id);
    this.selectTypesEmergencyDisasterService.setTypes(id);
    this.selectTypesEmergencyDisasterService.TypesEvent.emit(id);
    
  }


  slideToogle(select : string){
    console.log("Checked: ", select);
    this.selected = select;

  }


  getcheckStatus(event) {

    this.selectTypesEmergencyDisasterService.setStatus(event.checked);
    this.selectTypesEmergencyDisasterService.TypesEventBoolean.emit(event.checked);
    console.log(event.checked)

    /*if(event.checked){
      this.emergencyDisaster = this.emergencyDisasterClone.filter(data => data.emergencyDisasterEndDate !== null);
    }
    else if (!event.checked){
      this.emergencyDisaster = this.emergencyDisasterClone.filter(data => data.emergencyDisasterEndDate === null);
    }*/
  }



  ngOnDestroy(): void {

  }


}
