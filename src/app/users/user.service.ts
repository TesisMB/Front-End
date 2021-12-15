import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../services';
import { Role, RoleName } from '../models';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class UserService extends DataService{


  constructor(http: HttpClient, public _employeeForm: FormBuilder, authenticateService: AuthenticationService) {
    super(http, 'employees', authenticateService);
}

public get listarRoles(): Role[] {
const array = Object.values(RoleName);
let roles: Role[];
  roles = array.map((role,i) => {  return new Role(i+1, role);});
  return roles;
}



public get EmployeeForm () {
return this._employeeForm.group({
    employeeID:[],
    employeeCreatedate: [],
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
        estateID: [],
        estatePhone: [],
        estateTypes: [],
        locationAddressID: [],
        postalCode: [],
        address: [],
        numberAddress: [],
        locationsID: [],
        locationCityName: [],
         estatesTimes: this._employeeForm.array([
           this._employeeForm.group({
            
              times: [],
              scheduleDate:[]
              })
            ]),
      }),
      locations: this._employeeForm.group({
        locationCityName: [],
        locationDepartmentName: [],
        locationMunicipalityName: []
      }),
      userDni: [{},[Validators.required]],
      FK_RoleID:[{},[Validators.required]],
      roleName: [],
      userAvailability: [{},[Validators.required]],
      userID: [{},[Validators.required]]

    })

    });
}

}
