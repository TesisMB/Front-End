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
    super(http, '/employees', authenticateService);
}

public get listarRoles(): Role[] {
const array = Object.values(RoleName);
let roles: Role[];
  roles = array.map((role,i) => {  return new Role(i+1, role);});
  return roles;
}

public generatePDF(id): any {
  const headers = new HttpHeaders().set('Accept', 'application/pdf');
  return this.http.get(environment.URL + this.patch+'/pdf/'+id,  {
    headers: headers,
    observe: 'response',
    responseType: 'blob' as 'json'
  });
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
        estateID: [],
        estateTypes: [],
        estatePhone: [],
        locationAddress: this._employeeForm.group({
          locationAddressID: [],
          postalCode: [],
          numberAddress: [],
          address: [],
        }),
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
