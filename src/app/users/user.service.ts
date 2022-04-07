import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DataService } from '../services/data.service';
import { Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../services';
import { Group, Role, RoleName, Input } from '../models';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


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
      // }),
      // locations: this._employeeForm.group({
      //   locationCityName: [],
      //   locationDepartmentName: [],
      //   locationMunicipalityName: []
      }),
      userDni: [{},[Validators.required]],
      FK_RoleID:[{},[Validators.required]],
      roleName: [],
      userAvailability: [{},[Validators.required]],
      userID: [{},[Validators.required]]

    })

    });
}

getLocations(): Observable<any> {
  const arrayEmergencies: Input[] = [];

    return this.http.get<any>(environment.URL + 'estates');
  //   .pipe(map( data => {
  //     data.forEach(e => {
  //       const location: Group = {
  //         name: e.locationCityName,
  //         data: e.estates,
  //         id: e.locationID
  //       };
  //     });
  //   return data;
  // }));
}

}
