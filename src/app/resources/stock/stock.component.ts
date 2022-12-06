import { Subscription } from 'rxjs';
import { AlertService } from './../../services/_alert.service/alert.service';
import { ResourcesService } from './../resources.service';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { filter, map } from 'rxjs/operators';
import { Resource, User } from 'src/app/models';
import { AuthenticationService } from 'src/app/services';
import { UserService } from 'src/app/users';
const TABS = ['materiales', 'medicamentos', 'vehiculos'];
import { NgbdResourcesFiltersDialogComponentComponent } from '../ngbd-resources-filters-dialog-component/ngbd-resources-filters-dialog-component.component';
import { MatDialog } from '@angular/material/dialog';
import { StatesService } from '../states/states.service';
import { ReportService } from 'src/app/services/_report.service/report.service';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent implements OnInit, OnDestroy {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  locations: any;
  estates = [];
  tabs = TABS;
  condition: boolean = false;
  type: string = 'materiales';
  handleRequest: Subscription;
  handleLocation: Subscription;
  handleDonation: Subscription;
  handleData: Subscription;
  handleAvailability: Subscription;
  currentUser: User = JSON.parse(localStorage.getItem('currentUser'));
  locationSelected = this.currentUser.estates.locationID;
  reports = true;
  resource = null;
  checked = true;
  selectedType: string = 'reportes';
  isDisabled = true;
  isChange : boolean = false;
  constructor(
    public service: ResourcesService,
    private alertService: AlertService,
    private authService: AuthenticationService,
    private userService: UserService,
    private stateService: StatesService,
    public dialog: MatDialog,
    public reportService: ReportService
  ) { }

  ngOnInit(): void {
    this.service._setType(this.type);
    this.service.type$.subscribe(type => { this.changeCondition(type); }, error => { console.log(error); });
    this.handleLocation = this.reportService.location$
      .subscribe(location => {
        if (this.locationSelected !== location || this.isChange) {
            this.selectLocation(location);
        }
      }, error => console.error(error));
    this.handleDonation = this.reportService.hasDonation$.subscribe(donation => { if (this.resource) this.onDonation(donation); }, error => console.error(error));
    this.handleAvailability = this.reportService.hasAvailability$.subscribe(availability => { if (this.resource) this.onShow(availability); }, error => console.error(error));
    this.getLocations();
    this.getData();
  }
  get isReport() {
    return this.selectedType !== 'table';
  }
  set isReport(value: boolean) {
    this.reports = value;
  }
  changeCondition(event) {
    this.service.loading = true;
    this.reportService.loading = true;
    console.log('Tab cambiada', event);
    this.type = event ? event.toLowerCase() : '';
    this.getResources(this.locationSelected);
  }
  selectLocation(event) {
    this.locationSelected = event;
    console.log('Localidad seleccionada! => ', event);
    this.getResources(event);
  }
  openDialog(tipo: string) {
    const dialogRef = this.dialog.open(NgbdResourcesFiltersDialogComponentComponent);
    dialogRef.componentInstance.tipo = tipo;
  }
  getResources(location?) {
    this.handleRequest = this.service.getAll(location)
      .subscribe((x: Resource[]) => {
        this.changePath();
        this.resource = x;
        this.reportService.data = x;
        console.log('Data original => ', x);
      },
        e => {
          this.alertService.error('Ups..! error inesperado, vuelva a intentar mas tarde', { autoClose: true });
        });
  }
  private getData(){
    this.handleData = this.reportService.backUpData$
                      .subscribe(data =>this.isChange = this.resource !== data, error => console.error(error))
  }
  onShow(event) {
    this.service.showAvailability = event;
    console.log('Evento => ', event);
  }
  onDonation(event) {
    this.service.showDonation = event;
    console.log('Evento => ', event);
  }

  generatePDF() {
    let fileName = `${this.authService.currentUserValue.persons.firstName} ${this.authService.currentUserValue.persons.lastName}`;
    this.service.generatePDF(this.authService.currentUserValue.estates.estateID).subscribe(res => {
      const file = new Blob([<any>res], { type: 'application/pdf' });
      const fileURL = window.URL.createObjectURL(file);
      window.open(fileURL, fileName);
    });
  }

  private getLocations() {
    this.stateService.getAll()
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

  changeType(event) {
    this.reportService.searchType = event;
  }

  private changePath() {
    if (this.type.includes('materiales')) {
      this.reportService.searchPath = ['name', 'locationCityName', 'donation', 'availability', 'materials.brand'];
    } else if (this.type.includes('medicamentos')) {
      this.reportService.searchPath = ['name', 'locationCityName', 'donation', 'availability', 'medicines.medicineDrug', 'medicines.medicineLab'];
    } else if (this.type.includes('vehiculos')) {
      this.reportService.searchPath = ['name', 'locationCityName', 'donation', 'availability', 'vehicles.brandName', 'vehicles.vehicleUtility', 'vehicles.type', 'vehicles.employeeName'];
    }
  }

  manageAccordion() {
    if (this.isDisabled) {
      console.log('Open');
      this.accordion.openAll();
      this.isDisabled = false;
    } else if (!this.isDisabled) {
      this.accordion.closeAll();
      console.log('Close');
      setTimeout(x => { this.isDisabled = true; }, 1000);


    }
  }

  ngOnDestroy(): void {
    this.reportService.resetForm(true);
    this.handleRequest.unsubscribe();
    this.handleLocation.unsubscribe();
    if (this.handleDonation) {
      this.handleDonation.unsubscribe();
    }
    if (this.handleAvailability) {
      this.handleAvailability.unsubscribe();
    }
    

  }

}

