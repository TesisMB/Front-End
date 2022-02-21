import { Observable } from 'rxjs';
import { EmergencyDisasterService } from './../emergency-disaster.service';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ngbd-modal',
  templateUrl: './ngbd-modal.component.html',
  styleUrls: ['./ngbd-modal.component.css']
})
export class NgbdModalComponent implements OnInit {

@Input() emergencyDisaster: EmergencyDisaster;
/*  public dataObservable : Observable<number>;
 */
firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private emergencyDisasterService: EmergencyDisasterService,
    private _formBuilder: FormBuilder
    ) {

 /*     this.dataObservable = this.emergencyDisasterService.EmergencyDisasterSubject$
     console.log("EmergencyDisaster - Observable => ", this.dataObservable); */
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
