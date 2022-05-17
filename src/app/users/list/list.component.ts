import { Subscription } from 'rxjs';
import { TableService } from 'src/app/services/_table.service/table.service';
import { UserService } from './../user.service';
import { AuthenticationService, AlertService } from 'src/app/services';

import { Component, OnInit, OnDestroy} from '@angular/core';
import { Employee } from 'src/app/models';
@Component({
  selector: 'list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy{
  ubication: string = "";
  employees: Employee[] = [];
  handleSU: Subscription;
  constructor(private _authenticationService: AuthenticationService,
    private service : UserService,
    private alertService: AlertService,
    private tableService: TableService
    ) {}

  ngOnInit() {    
       this.ubication = this._authenticationService.currentUserValue.estates.locationCityName;
       this.getUsers();
}

public getUsers() {

  this.handleSU = this.service.getAll(this._authenticationService.currentUserValue.userID)
  .subscribe(
    (result: Employee[]) => {
      this.employees = result;
      this.setUsers(result);
      console.log('GetAll AJAX ejecutado');
    console.log('Empleados: ', this.employees);

   },
     error => { 
       console.log('Error: ' + error.message);
       this.alertService.error('No se ha podido cargar, intentelo nuevamente más tarde.');
      });
    
}

public setUsers(employees: Employee[]) {
   this.tableService.uploadTable(employees);
}

  ngOnDestroy(){
    this.handleSU.unsubscribe();
  }
}
