import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from '../services';

@Injectable({ providedIn: 'root' })
export class UserService extends DataService{


  constructor(http: HttpClient, public _employeeForm: FormBuilder, authenticateService: AuthenticationService) {
    super(http, '/employees', authenticateService);
}


public get EmployeeForm () {
return this._employeeForm.group({
    employeeID:[],
    users: this._employeeForm.group({
      persons: this._employeeForm.group({
        lastName: [{},[Validators.required]],
        firstName:[{},[Validators.required]],
        gender: [{},[Validators.required]],
        birthdate: [{},[Validators.required]],
        phone:    [{},[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        email:    [{},[Validators.required,Validators.email]],
        address: [{},[Validators.required,Validators.pattern, Validators.maxLength(25)]],
        status: [{},[Validators.required]]
      }),
      estates: this._employeeForm.group({
        locationAddress: this._employeeForm.group({
          numberAddress: [],
          address: [],
        }),
         estatePhone: [],
         estatesTimes: this._employeeForm.array([
           this._employeeForm.group({
            
              times: this._employeeForm.group({
            startTime:[],
            endTime:[],
              schedules: this._employeeForm.group({
                scheduleDate:[]
              }),
            
          })
        }),
            ]),
        estateID: []
        
      }),
      userDni: [{},[Validators.required]],
      roleName: [{},[Validators.required]],
      userAvailability: [{},[Validators.required]],
      userID: [{},[Validators.required]]

    })

    });
}

}
