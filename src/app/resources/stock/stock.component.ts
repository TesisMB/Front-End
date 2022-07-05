import { Subscription } from 'rxjs';
import { AlertService } from './../../services/_alert.service/alert.service';
import { ResourcesService } from './../resources.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter } from 'rxjs/operators';
import { Resource } from 'src/app/models';
import { AuthenticationService } from 'src/app/services';
import { UserService } from 'src/app/users';
const TABS = ['materiales', 'medicamentos', 'vehiculos'];
import { NgbdResourcesFiltersDialogComponentComponent} from '../ngbd-resources-filters-dialog-component/ngbd-resources-filters-dialog-component.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit, OnDestroy {

  tabs = TABS;
  condition: boolean = false;
  type: string = 'materiales';
  handleRequest: Subscription;

  constructor(
    public service: ResourcesService,
    private alertService: AlertService,
    private authService: AuthenticationService,
    private userService: UserService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.service._setType(this.type);
    this.getResources();
    
  }

  changeCondition(event){
     this.type =  event.tab.textLabel.toLowerCase();
     console.log('Tab cambiada', this.type);
      this.service._setType(this.type);
      this.getResources();
  }


  openDialog(tipo: string){
    const dialogRef = this.dialog.open(NgbdResourcesFiltersDialogComponentComponent);
    dialogRef.componentInstance.tipo = tipo;
  
  }

  getResources(){
    this.handleRequest = this.service.getAll(this.authService.currentUserValue.userID)
    .subscribe((x: Resource[]) =>{
    const resourcesFilters = x.filter(x => x.availability !== this.condition)
    this.service.uploadTable(resourcesFilters);
    //this.service._setType(type);
      console.log('x => ', resourcesFilters );
    },
  e => {
    this.alertService.error('Ups..! error inesperado, vuelva a intentar mas tarde', {autoClose: true});
  
  } );
  }
  onShow(event){
    this.condition = event.checked;
    this.getResources()
    console.log('Evento => ', this.condition);
  }
  ngOnDestroy(): void {
      this.handleRequest.unsubscribe();
  }



  generatePDF(){ 
    //let fileName = `${this.user.users.persons.firstName} ${this.user.users.persons.lastName}`;
      let fileName = `${this.authService.currentUserValue.persons.firstName} ${this.authService.currentUserValue.persons.lastName}`;
      this.service.generatePDF(this.authService.currentUserValue.estates.estateID).subscribe(res => {
        const file = new Blob([<any>res], {type: 'application/pdf'});
      //  saveAs(file, fileName);
        const fileURL = window.URL.createObjectURL(file);
        window.open(fileURL, fileName);
      });
    }

}

