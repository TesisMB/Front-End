import { Subscription } from 'rxjs';
import { AlertService } from './../../services/_alert.service/alert.service';
import { ResourcesService } from './../resources.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { Resource } from 'src/app/models';
import { AuthenticationService } from 'src/app/services';
import { UserService } from 'src/app/users';
const TABS = ['materiales', 'medicamentos', 'vehiculos'];
import { NgbdResourcesFiltersDialogComponentComponent} from '../ngbd-resources-filters-dialog-component/ngbd-resources-filters-dialog-component.component';
import { MatDialog } from '@angular/material/dialog';
import { StatesService } from '../states/states.service';
import { ReportService } from 'src/app/services/_report.service/stock-report.service';

@Component({
  selector: 'stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit, OnDestroy {
  locations = [];
  estates = [];
  tabs = TABS;
  condition: boolean = false;
  type: string = 'materiales';
  handleRequest: Subscription;
  locationSelected = '';
  reports = true;
  resource = null;
  checked = true;
  selectedType: string ='table';
  constructor(
    public service: ResourcesService,
    private alertService: AlertService,
    private authService: AuthenticationService,
    private userService: UserService,
    private stateService: StatesService,
    public dialog: MatDialog,
    public reportService : ReportService
  ) { }

  ngOnInit(): void {
    this.service._setType(this.type);
    this.getResources();  
    this.getLocations();  
  }
get isReport(){
  return this.selectedType !== 'table';
}

set isReport(value: boolean){
  this.reports = value;
}

  changeCondition(event){
    this.service._setLoading(true);
    this.reportService.loading = true;
     this.type =  event.tab.textLabel.toLowerCase();
     console.log('Tab cambiada', this.type);
      this.service._setType(this.type);
      this.getResources();
  }
selectLocation(event){
  console.log('Localidad seleccionada! => ', event);
  this.service._setLoading(true);
  this.getResources(event);
}

  openDialog(tipo: string){
    const dialogRef = this.dialog.open(NgbdResourcesFiltersDialogComponentComponent);
    dialogRef.componentInstance.tipo = tipo;
  
  }

  getResources(location?){
    this.handleRequest = this.service.getAll(this.locationSelected)
    .subscribe((x: Resource[]) =>{
      this.resource = x;
      // this.reportService.searchPath = 'donation';
      this.reportService.data = x;
    // const resourcesFilters = x.filter(x => x.availability !== this.condition)
    // this.service.uploadTable(x);
    //this.service._setType(type);
      console.log('x => ', x  );
    },
  e => {
    this.alertService.error('Ups..! error inesperado, vuelva a intentar mas tarde', {autoClose: true});
  
  } );
  }
  onShow(event){
    this.service.showAvailability = event.checked;
    this.getResources();
    console.log('Evento => ', event.checked);
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

  private getLocations(){
    this.stateService.getAll()
    //  .pipe(map(x => {

    //  }))
    .subscribe(
      data => {
        this.locations = data;
        data.forEach(e => {
          this.estates.push(e.estates);
        });
        console.log(data);
        console.log(this.estates);
 
      },
      error => {
        console.log(error);
      }
    )
  }

  changeType(event){
    this.reportService.searchType = event;
  }

  ngOnDestroy(): void {
      this.handleRequest.unsubscribe();
  }

}

