import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../services';
import { Group, Role, RoleName, Input } from '../models';
import { environment } from 'src/environments/environment';
import { Observable, pipe } from 'rxjs';
import { map, filter } from 'rxjs/operators';


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
        lastName: [{},[Validators.required, Validators.pattern("[a-zA-Z ]{2,15}")]],
        firstName:[{},[Validators.required, Validators.pattern("[a-zA-Z ]{2,15}")]],
        gender: [{},[Validators.required]],
        birthdate: [{},[Validators.required]],
        phone:    [{},[Validators.required,Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        email:    [{},[Validators.required,Validators.email]],
        address: [{},[Validators.required, Validators.maxLength(20)]],
        status: [{},[Validators.required]],
        locationName: [{},[Validators.required, Validators.maxLength(20)]]
      }),
      estates: this._employeeForm.group({
         estateID: [],
        estatePhone: [],
        estateTypes: [],
        postalCode: [],
        address: [{},[Validators.maxLength(20)]],
        // locationsID: [],
        locationCityName: [{},[Validators.maxLength(20)]],
         estatesTimes: this._employeeForm.array([
           this._employeeForm.group({
              times: [],
              scheduleDate:[]
              })
            ]),

      }),
      userDni: [{},[Validators.required]],
      FK_RoleID:[{},[Validators.required]],
      roleName: [],
      userAvailability: [{},[Validators.required]],
      userID: [{},[Validators.required]],
      FK_EstateID: ['',[Validators.required]],
    })

    });
}

getLocations(patch: string): Observable<any> {
  const arrayEmergencies: Input[] = [];

    return this.http.get<any>(environment.URL + patch)
    .pipe(map( data => {
     return data.filter(e => e.locationCityName === this.authenticateService.currentUserValue.estates.locationCityName)
  }));}

}
