import { RequestService } from 'src/app/resources/request/request.service';
import { ResourcesService } from './../resources.service';
import { Component, OnInit } from '@angular/core';
import { AlertService, AuthenticationService } from 'src/app/services';
import { UserService } from 'src/app/users';

@Component({
  selector: 'ngbd-resources-filters-dialog-component',
  templateUrl: './ngbd-resources-filters-dialog-component.component.html',
  styleUrls: ['./ngbd-resources-filters-dialog-component.component.css']
})
export class NgbdResourcesFiltersDialogComponentComponent implements OnInit {


 tipo: string;
 startDate: any;
 endDate: any;
selectValue: any;
selected: any;
maxDate = new Date(2022, 6, 5);

  constructor(
    private authService: AuthenticationService,
    private userService: UserService,
    private resourceService: ResourcesService,
    private alertService: AlertService,
    private requestService: RequestService 

  ) { }

  ngOnInit(): void {
  }


  select(){
console.log(this.selected);
  }

  dateEnd(event){
  this.endDate = event.value;
  console.log(this.endDate);
}

  dates(event){
    this.startDate = event.value;
  console.log(this.startDate);
  }

  generatePDF(){ 
    if(this.selected == null){

      //let fileName = `${this.user.users.persons.firstName} ${this.user.users.persons.lastName}`;
      //let fileName = `${this.currentUser.persons.firstName} ${this.currentUser.persons.lastName}`;
      let fileName = 'Recursos';
      this.resourceService.generatePDFResources(this.startDate, this.tipo).subscribe(res => {
        const file = new Blob([<any>res], {type: 'application/pdf'});
      //  saveAs(file, fileName);
        const fileURL = window.URL.createObjectURL(file);
        window.open(fileURL, fileName);
      }), error =>{
        this.alertService.error('No hay ningun recurso en la fecha establecida.');
        console.log("Error en el formulario!!!", error);
      };
    }
  else{

      //let fileName = `${this.user.users.persons.firstName} ${this.user.users.persons.lastName}`;
      //let fileName = `${this.currentUser.persons.firstName} ${this.currentUser.persons.lastName}`;
      let fileName = 'Solicitudes';
      this.requestService.generatePDFRequest(this.startDate, this.selected).subscribe(res => {
        const file = new Blob([<any>res], {type: 'application/pdf'});
      //  saveAs(file, fileName);
        const fileURL = window.URL.createObjectURL(file);
        window.open(fileURL, fileName);
      }), error =>{
        this.alertService.error('No hay ningun recurso en la fecha establecida.');
        console.log("Error en el formulario!!!", error);
      };
  }
  }
}
