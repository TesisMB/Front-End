import { RequestService } from 'src/app/resources/request/request.service';
import { ResourcesService } from './../resources.service';
import { Component, OnInit } from '@angular/core';
import { AlertService, AuthenticationService } from 'src/app/services';
import { UserService } from 'src/app/users';
import { Subscription } from 'rxjs';
import { RequestTableService } from '../request-table/request-table.service';
import { map } from 'rxjs/operators';
import { SelectTypesEmergencyDisasterService } from 'src/app/emergency-disaster/select-types-emergency-disaster.service';

@Component({
  selector: 'ngbd-resources-filters-dialog-component',
  templateUrl: './ngbd-resources-filters-dialog-component.component.html',
  styleUrls: ['./ngbd-resources-filters-dialog-component.component.css']
})
export class NgbdResourcesFiltersDialogComponentComponent implements OnInit {

  handleRequest: Subscription;

 tipo: string;
 startDate: any;
 endDate: any;
selectValue: any;
selected: any;
maxDate = new Date(2022, 6, 21);
arrayRequest = [];
id: number;
emergencyid: number;
arraytypeEmergencyDisaster = [];
loading = false;

  constructor(
    private authService: AuthenticationService,
    public selectTypesEmergencyDisasterService : SelectTypesEmergencyDisasterService,
    private userService: UserService,
    private resourceService: ResourcesService,
    private alertService: AlertService,
    private requestService: RequestService,
    public service: RequestTableService,


  ) { }

  ngOnInit(): void {
  }


  select(){
  console.log(this.selected);
  this.getRequest(this.selected);
  }

  dateEnd(event){
  this.endDate = event.value;
  console.log(this.endDate);
}

  dates(event){
    this.startDate = event.value;
  console.log(this.startDate);
  }

  selectTypes(id: number){
    this.id = id;
    console.log("data => ", id);
  }

  selectTypesEmergency(id: number){
    this.emergencyid = id;
    console.log("data => ", id);
  }



  // getTypeEmergencyDisaster(){
  //   this.selectTypesEmergencyDisasterService.getAll()
  //   .pipe(
  //     map((x) =>{
  //       x.forEach(item =>{
  //         const types = {
  //           id: item.typeEmergencyDisasterID,
  //           name: item.typeEmergencyDisasterName
  //         };
  //         this.arraytypeEmergencyDisaster.push(types);
  //       })

  //         console.log('arraytypeEmergencyDisaster []', this.arraytypeEmergencyDisaster);
          
  //         return x;
  //     }))
  //   .subscribe(data =>{
  //   }, error =>{
  //     console.log("Error =>", error);
  //   })
  // }

  getRequest(condition){
    this.handleRequest = this.requestService.getAll(condition)
    .pipe(
      map((x) => {
        x.forEach(item => {
          const types = {
            id: item.createdBy,
            name: item.createdByEmployee,
            emergnecyId: item.emergencyDisasterID,
            emergencyName: item.typeEmergencyDisasterName
          };
          this.arrayRequest.push(types);
        });

        console.log('arrayRequest []', this.arrayRequest);
          
        return x;
      })
    )
    .subscribe((x: any) =>{
    // this.service._uploadTable(x);
    // this.service._setCondition(condition);
      console.log('x => ', x);
    },
  e => {
    this.alertService.error('Ups..! error inesperado, vuelva a intentar mas tarde', {autoClose: true});
  
  } );
  }


  generatePDF(){ 
    if(this.selected == null){
      this.loading = true;

      //let fileName = `${this.user.users.persons.firstName} ${this.user.users.persons.lastName}`;
      //let fileName = `${this.currentUser.persons.firstName} ${this.currentUser.persons.lastName}`;
      let fileName = 'Recursos';
      this.resourceService.generatePDFResources(this.startDate, this.tipo, this.endDate, this.authService.currentUserValue.userID).subscribe(res => {
        const file = new Blob([<any>res], {type: 'application/pdf'});
      //  saveAs(file, fileName);
        const fileURL = window.URL.createObjectURL(file);
        window.open(fileURL, fileName);
      this.loading = false;

      }), error =>{
        this.alertService.error('No hay ningun recurso en la fecha establecida.');
        console.log("Error en el formulario!!!", error);
      };
    }
  else{

      //let fileName = `${this.user.users.persons.firstName} ${this.user.users.persons.lastName}`;
      //let fileName = `${this.currentUser.persons.firstName} ${this.currentUser.persons.lastName}`;
      let fileName = 'Solicitudes';
      this.requestService.generatePDFRequest(this.startDate, this.selected, this.endDate, this.id, this.emergencyid).subscribe(res => {
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
