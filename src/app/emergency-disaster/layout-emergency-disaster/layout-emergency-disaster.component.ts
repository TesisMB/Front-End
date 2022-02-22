import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { EmergencyDisasterService } from '../emergency-disaster.service';
import * as _ from 'lodash';

@Component({
  selector: 'layout-emergency-disaster',
  templateUrl: './layout-emergency-disaster.component.html',
  styleUrls: ['./layout-emergency-disaster.component.css']
})
export class LayoutEmergencyDisasterComponent implements OnInit, OnDestroy {

  emergencyDisaster: EmergencyDisaster [];
  selected: string;
  isActive: boolean = false;
  emergencyDisasterClone: EmergencyDisaster [];

  constructor(

    ) {
  }


  ngOnInit(): void {

  }

  slideToogle(select : string){
    console.log("Checked: ", select);
    this.selected = select;

  }


  getcheckStatus(event) {
    if(event.checked){
      this.emergencyDisaster = this.emergencyDisasterClone.filter(data => data.emergencyDisasterEndDate !== null);
    }
    else if (!event.checked){
      this.emergencyDisaster = this.emergencyDisasterClone.filter(data => data.emergencyDisasterEndDate === null);
    }
  }



  ngOnDestroy(): void {

  }


}
