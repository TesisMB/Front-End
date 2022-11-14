import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { RequestTableService } from 'src/app/resources/request-table/request-table.service';
import { ResourceModalComponent } from 'src/app/shared/resource-modal/resource-modal.component';
import { ResourcesRequestViewComponent } from '../resources-request-view/resources-request-view.component';
interface ResourcesRequestReports {
  id: number;
  condition: string;
  resquestDate: string;
  city: string;
  type: string;
}

interface ReportData{
  name: string;
  value: number;
}
enum Condition {
  TODOS = 'Todas',
  ACEPTADAS = 'Aceptada',
  RECHAZADAS = 'Rechazada',
  PENDIENTES = 'Pendiente'
}

const ACEPTADAS = 'Aceptada';
const RECHAZADAS = 'Rechazada';
const PENDIENTES = 'Pendiente';

class Reports{
  condition: {data: ReportData[], selected: boolean};
  city: {data: ReportData[], selected: boolean};
  type: {data: ReportData[], selected: boolean};
  }


@Component({
  selector: 'resources-request-report',
  templateUrl: './resources-request-report.component.html',
  styleUrls: ['./resources-request-report.component.css'],
  encapsulation: ViewEncapsulation.None

})
export class ResourcesRequestReportComponent implements OnInit {
  @Input() data: ResourcesRequestReports[] = null ;
  dataClone: ResourcesRequestReports[] = null;
  selectedType: string = "list";
  condition = Condition;
  selected = this.condition.TODOS;

  view: any[] = [700, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showYAxisLabel: boolean = true;
  showYAxisLabelCity: boolean = true;
  xAxisLabel: string = 'Solicitudes';
  yAxisLabelCity: string = 'Ciudad';
  showXAxisLabel = true;
  yAxisLabel = 'Tipo de alerta';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  reports: Reports = {
    condition:  {data: null, selected: false},
    city:  {data: null, selected: false},
    type:  {data: null, selected: false},

  }
  
  control = new FormControl(
    {
      from: null,
      to: null
    },
  );
  filterState: any;

  constructor(   
     private modalService: NgbModal,
    public dialog: MatDialog,
    private requestService: RequestTableService,
    ) {    

    }

    get isSelected(){
      return !this.reports.condition.selected && !this.reports.city.selected && !this.reports.type.selected;
     }
   

  ngOnInit(): void {
    console.log('Reporte DATA => ',this.data);

    this.dataClone = Object.assign(this.data);
    console.log('Reporte SOLICITUDES => ',this.reports);
    this.setAll();

  }

  setVisible(value){
    this.reports.type.selected = value === 'type';
    this.reports.city.selected = value === 'city';
    this.reports.condition.selected = value === 'condition';
  }


  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    // const dialogRef = this.dialog.open(ResourcesRequestViewComponent);

  }

  openModal(id: number){
    const modalRef = this.modalService.open(ResourceModalComponent, { size: 'lg', centered: true, scrollable: true });
    const obtenerIndex = this.requestService.ObtenerSolicitud(id);
    modalRef.componentInstance.resources = this.requestService.requestValue[obtenerIndex];
}

  filterByState(event: any){
    this.filterState = event;
    const form = this.control.value;

    if( form.from != null){
      this.formateDate();
    }
    if(event !== this.condition.TODOS){
      this.dataClone = this.data.filter(p => p.condition === event);
    }else{
      this.dataClone = Object.assign(this.data);
    }
    this.setAll();
  }


  formateDate(){
    const dateForm = this.control.value;
    const isEndDate = moment(dateForm.to);
    const startDate = moment(dateForm.from);

    // let latest_date =this.datepipe.transform(startDate, 'yyyy-MM-dd');
    // console.log('Fecha formateada => ',latest_date);

    
     this.dataClone = dateForm.to ?
     this.data.filter(f =>   moment(f.resquestDate).isBetween(startDate,isEndDate)) :
     this.data.filter(f => moment(f.resquestDate).isAfter(startDate));

    console.log('clone data => ',this.dataClone);
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  onSelectCity(filter: any): void {
    const f = typeof filter === 'object' ? filter.name : filter;
    console.log('Tipo filtro: ',typeof filter);
    console.log('Item clicked', JSON.parse(JSON.stringify(filter)));
    const citys = this.dataClone.filter(d => d.condition === f);
    this.getCitys(citys);
  }


  onSelectDegree(filter: any): void {
    const f = typeof filter === 'object' ? filter.name : filter;
    console.log('Tipo filtro: ',typeof filter);
    console.log('Item clicked', JSON.parse(JSON.stringify(filter)));
    const degrees = this.dataClone.filter(d => d.type === f);
    this.getDegree(degrees);

  } 

  onSelectUbication(filter: any): void {
    const f = typeof filter === 'object' ? filter.city : filter;
    console.log('Tipo filtro: ',typeof filter);
    console.log('Item clicked', JSON.parse(JSON.stringify(filter)));
    const city = this.dataClone.filter(d => d.city === f);
    this.ubicación(city);
  } 

ubicación(data){

  this.setVisible('city');  
  this.reports.city.data = [...data.reduce( (mp, o) => {
      if (!mp.has(o.city)) mp.set(o.type, { name: o.city, value: 0 });
      mp.get(o.city).value++;
      return mp;
  }, new Map).values()];
  }

  getDegree(data){
    this.setVisible('type');  
    this.reports.type.data = [...data.reduce( (mp, o) => {
        if (!mp.has(o.type)) mp.set(o.type, { name: o.type, value: 0 });
        mp.get(o.type).value++;
        return mp;
    }, new Map).values()];
    }

  get getActiveList(){
    return this.data.filter(p => p.condition === ACEPTADAS);
  }

  get getInactiveList(){
    return this.data.filter(p => p.condition === RECHAZADAS);
  }

  
  get getPendienteList(){
    return this.data.filter(p => p.condition === PENDIENTES);
  }

getCitys(data){

  this.setVisible('city');  
  this.reports.condition.data= [...data.reduce( (mp, o) => {
      if (!mp.has(o.city)) mp.set(o.condition, { name: o.condition, value: 0});
      mp.get(o.condition).value++;
      return mp;
  }, new Map).values()];
  }

  openDialog(i, tipo: string){
    const dialogRef = this.dialog.open(ResourcesRequestViewComponent);
  }


  setAll(){
    this.reports.condition.data = [...this.dataClone.reduce( (mp, o) => {
      
      if (!mp.has(o.condition)) mp.set(o.condition, { name: o.condition, value: 0 });
      mp.get(o.condition).value++;
      return mp;
    }, new Map).values()];
  
  this.reports.city.data= [...this.dataClone.reduce( (mp, o) => {
    if (!mp.has(o.city))  mp.set(o.city, { name: o.city, value: 0});
    mp.get(o.city).value++;
    return mp;
  }, new Map).values()];

  this.reports.type.data= [...this.dataClone.reduce( (mp, o) => {
    if (!mp.has(o.type))  mp.set(o.type, { name: o.type, value: 0});
    mp.get(o.type).value++;
    return mp;
  }, new Map).values()];
}

formatingAxisX(event: number){
  if(typeof event === 'number'){
    // event = Math.round(event);
    console.log('Evento Formating => ', event);
    return event % 1 === 0 ? event :  ''; 
  }
 return event;
}

}
