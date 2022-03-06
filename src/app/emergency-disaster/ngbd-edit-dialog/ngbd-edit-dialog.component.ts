import { EmergencyDisasterService } from './../emergency-disaster.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import {compare} from 'fast-json-patch';
import { _deepClone } from 'fast-json-patch/module/helpers';

@Component({
  selector: 'ngbd-edit-dialog',
  templateUrl: './ngbd-edit-dialog.component.html',
  styleUrls: ['./ngbd-edit-dialog.component.css']
})
export class NgbdEditDialogComponent implements OnInit {

  @Input() emergencyDisaster: EmergencyDisaster;
  model : EmergencyDisaster;
  originalEmergencyDisaster: EmergencyDisaster;

  emergencyDisasterForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NgbdEditDialogComponent>,
    private fb: FormBuilder,
    private emergencyDisasterService : EmergencyDisasterService
  ) {}

  ngOnInit(): void {
    this.emergencyDisasterForm = this.initForm();
    this.onatchValue();

    this.emergencyDisasterService.getAll().subscribe((data: EmergencyDisaster[])=>{
      this.model = Object.assign({}, this.emergencyDisaster[0]);
      this.originalEmergencyDisaster = this.emergencyDisaster[0];
    })

    /* this.model = _deepClone(this.emergencyDisaster);

    console.log("Model =>", this.model);
    console.log("originalEmergencyDisaster =>", this.emergencyDisaster); */
  }


  alertColor(alert: string){
    if(alert === 'Extremo'){
      return '#FADBD8';
    }
    else if(alert === 'Moderado'){
      return '#FCF3CF';
    }
    else{
      return '#D5F5E3';
  
      }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onatchValue(){
    this.emergencyDisasterForm.patchValue({
      'name': this.emergencyDisaster.employees.name,
      'instruction': this.emergencyDisaster.emergencyDisasterInstruction
    });
  }

  updateEmergency(EmergencyDisaster: EmergencyDisaster){
    this.model = Object.assign({}, EmergencyDisaster);
    this.originalEmergencyDisaster = EmergencyDisaster;
  }

  onSubmit(){
/*     const patch = compare(this.originalEmergencyDisaster, this.model);
 *//*     console.log("Form =>", this.emergencyDisasterForm.value)
 */    console.log("Patch =>", compare(this.originalEmergencyDisaster, this.model));
  }

  initForm(): FormGroup{
    return this.fb.group({
      name: ['', [Validators.required]],
      instruction:['', [Validators.required]]
    });
  }

}
