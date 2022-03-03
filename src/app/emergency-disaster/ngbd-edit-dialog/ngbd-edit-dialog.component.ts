import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'ngbd-edit-dialog',
  templateUrl: './ngbd-edit-dialog.component.html',
  styleUrls: ['./ngbd-edit-dialog.component.css']
})
export class NgbdEditDialogComponent implements OnInit {

  @Input() emergencyDisaster: EmergencyDisaster

  emergencyDisasterForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<NgbdEditDialogComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.emergencyDisasterForm = this.initForm();
    this.onatchValue()
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

  onSubmit(){
    console.log("Form =>", this.emergencyDisasterForm.value)
  }

  initForm(): FormGroup{
    return this.fb.group({
      name: ['', [Validators.required]],
      instruction:['', [Validators.required]]
    });
  }

}
