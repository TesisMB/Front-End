import { throwError, Subscription } from 'rxjs';
// import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ResourcesService } from '../../resources.service';
import { ReportService } from 'src/app/services/_report.service/report.service';

interface StockReports {
  id: number;
  location: string;
  availability: string;
  donation: string;
  name: string;
  startDate: string;
  endDate: string;
  icon: string;
}
interface ReportData{
  name: string;
  value: number;
}

enum States {
  ACTIVAS = 'Activa',
  INACTIVAS = 'Inactiva',
  TODOS = 'Todas'
}

enum Grades {
  URGENTE = 'Urgente',
  MODERADO = 'Moderado',
  CONTROLADO = 'Controlado'
}

class Reports{
  availability: {data: ReportData[], selected: boolean};
  location: {data: ReportData[], selected: boolean};
  donation: {data: ReportData[], selected: boolean};
  name: {data: ReportData[], selected: boolean};
  }

const ACTIVE = 'Activa';
const INACTIVE = 'Inactiva';
const DONATION = 'Recursos donados';
const BUYS = 'Recursos no donados';

@Component({
  selector: 'stock-report',
  templateUrl: './stock-report.component.html',
  styleUrls: ['./stock-report.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StockReportComponent implements OnInit {
  view: [number, number] = [500, 400];
  view2: [number, number] = [500, 400];
  view3: [number, number] = [600, 400];
  view4: [number, number] = [600, 400];
  data: any[] = null;
  dataClone: any[] = null;
  subscribe: Subscription;
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Tipos alertas';
  showYAxisLabel: boolean = true;
  showYAxisLabelCity: boolean = true;
  xAxisLabel: string = 'Cantidad';
  yAxisLabelCity: string = 'Ciudad';
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  cols = 1;
  isChecked = true;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };
  states =  States;
  arrayStates = Object.values(this.states);
  grades = Grades;
  selected = this.states.TODOS;
  selectedType: string = "list";
  date = new Date();
  // public datepipe: DatePipe;
  barChartcustomColors = 
  [
    { name: "Moderado", value: '#C7B42C' },
    { name: "Urgente", value: '#A10A28' },
    { name: "Controlado", value: '#5AA454' },

  ];

  reports: Reports = {
    availability:   {data: null, selected: false},
    location:   {data: null, selected: false},
    donation:  {data: null, selected: false},
    name: {data: null, selected: false},
  }


  control = new FormControl(
    {
      from: null,
      to: null
    },
  );
  filterState: any;
  constructor(private resourceService: ResourcesService, public service: ReportService) { }

   ngOnInit() {
    // this.getData();
    // console.log('Reporte => ',this.reports);
    // this.setAll();
    this.control.valueChanges.subscribe(date => {
    this.formateDate();
    console.log('clone data => ',this.dataClone);
    // this.setAll();
    });
  }
  get getActiveList(){
    return this.data.filter(p => p.donation === ACTIVE);
  }

  get getInactiveList(){
    return this.data.filter(p => p.donation === INACTIVE);
  }

  get isSelected(){
   return !this.reports.availability.selected && !this.reports.location.selected && !this.reports.name.selected && !this.reports.donation.selected;
  }

  get lstData(){
    return this.dataClone;
  }

  set lstData(filter: any){
  }

 getData(){
    this.subscribe =  this.resourceService.resourcesReport$
                    .subscribe(
                      (data) => {
                        this.data = data;
                        this.dataClone = data ? Object.assign(this.data) : [];
                        this.setAll();
  },
                      (error) => {console.log('Error en reports');}
                    );
  }

  /**
 * @author Matias Roldán
 * @description Metodo que reduce la informaciòn y genera un mapa de valores para generar los reportes 
 * @param data 
 * @return void
 */
 setAll(){
  this.reports.donation.data = [...this.dataClone.reduce( (mp, o) => {
    if (!mp.has(o.donation)) mp.set(o.donation, { name: (o.donation ? DONATION : BUYS), value: 0 });
    mp.get(o.donation).value++;
    return mp;
  }, new Map).values()];

  console.log('Data de donation => ',this.reports.donation.data );
  this.reports.availability.data= [...this.dataClone.reduce( (mp, o) => {
    if (!mp.has(o.availability)) mp.set(o.availability, { name: o.availability ? 'Disponibles' : 'No Disponibles', value: 0});
    mp.get(o.availability).value++;
    return mp;
}, new Map).values()];

this.reports.location.data= [...this.dataClone.reduce( (mp, o) => {
  if (!mp.has(o.estates.locationCityName)) mp.set(o.estates.locationCityName, { name: o.estates.locationCityName, value: 0});
  mp.get(o.estates.locationCityName).value++;
  return mp;
}, new Map).values()];

this.reports.name.data = [...this.dataClone.reduce( (mp, o) => {
  if (!mp.has(o.name)) mp.set(o.name, { name: o.name, value: 0 });
  mp.get(o.name).value += o.quantity ;
  return mp;
}, new Map).values()];
}

/**
 * @author Matias Roldán
 * @description Metodo que reduce la informaciòn y genera un mapa de valores para generar el reporte de donation 
 * @param data 
 * @return void
 */
 getStates(data){
  this.setVisible('donation');  
  this.reports.donation.data = [...data.reduce( (mp, o) => {
    if (!mp.has(o.donation)) mp.set(o.donation, { name: o.donation, value: 0 });
    mp.get(o.donation).value++;
    return mp;
  }, new Map).values()];
}
/**
 * @author Matias Roldán
 * @description Metodo que de filtrado del reporte de donation 
 * @param filter 
 * @return void
 */
onSelectState(filter: any): void {
  const f = typeof filter === 'object' ? filter.name : filter;
  console.log('Tipo filtro: ',typeof filter);
  console.log('Item clicked', JSON.parse(JSON.stringify(filter)));
  const states = this.dataClone.filter(d => d.donation === f);
  this.getStates(states);
}
/**
 * @author Matias Roldán
 * @description Metodo que reduce la informaciòn y genera un mapa de valores para generar el reporte de availability 
 * @param data 
 * @return void
 */
getType(data){
  this.setVisible('availability');  
  this.reports.availability.data= [...data.reduce( (mp, o) => {
      if (!mp.has(o.availability)) mp.set(o.availability, { name: o.availability, value: 0});
      mp.get(o.availability).value++;
      return mp;
  }, new Map).values()];
  }

  /**
 * @author Matias Roldán
 * @description Metodo que de filtrado del reporte de type 
 * @param filter 
 * @return void
 */
  onSelectType(filter: any): void {
    const f = typeof filter === 'object' ? filter.name : filter;
    console.log('Tipo filtro: ',typeof filter);
    console.log('Item clicked', JSON.parse(JSON.stringify(filter)));
    const types = this.dataClone.filter(d => d.type === f);
    this.getType(types);
  }
/**
 * @author Matias Roldán
 * @description Metodo que reduce la informaciòn y genera un mapa de valores para generar el reporte de location 
 * @param data 
 * @return void
 */
 getCitys(data){

  this.setVisible('location');  
  this.reports.location.data= [...data.reduce( (mp, o) => {
      if (!mp.has(o.location)) mp.set(o.location, { name: o.location, value: 0});
      mp.get(o.location).value++;
      return mp;
  }, new Map).values()];
  }
  /**
 * @author Matias Roldán
 * @description Metodo que de filtrado del reporte de location 
 * @param filter 
 * @return void
 */
   onSelectCity(filter: any): void {
    const f = typeof filter === 'object' ? filter.name : filter;
    console.log('Tipo filtro: ',typeof filter);
    console.log('Item clicked', JSON.parse(JSON.stringify(filter)));
    const citys = this.dataClone.filter(d => d.location === f);
    this.getCitys(citys);
  }
/**
 * @author Matias Roldán
 * @description Metodo que reduce la informaciòn y genera un mapa de valores para generar el reporte de name 
 * @param data 
 * @return void
 */
 getDegree(data){
  this.setVisible('name');  
  this.reports.name.data = [...data.reduce( (mp, o) => {
      if (!mp.has(o.name)) mp.set(o.name, { name: o.name, value: o.quantity });
      mp.get(o.name).value =mp.get(o.name).value + o.quantity;
      return mp;
  }, new Map).values()];
  }
/**
 * @author Matias Roldán
 * @description Metodo que de filtrado del reporte de name 
 * @param filter 
 * @return void
 */
  onSelectDegree(filter: any): void {
    const f = typeof filter === 'object' ? filter.name : filter;
    console.log('Tipo filtro: ',typeof filter);
    console.log('Item clicked', JSON.parse(JSON.stringify(filter)));
    const degrees = this.dataClone.filter(d => d.name === f);
    this.getDegree(degrees);

  } 

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  setVisible(value){
    this.reports.availability.selected = value === 'availability';
    this.reports.location.selected = value === 'location';
    this.reports.donation.selected = value === 'donation';
    this.reports.name.selected = value === 'name';
  }

  getCardColor(grade: string){
    if(grade === this.grades.URGENTE)return '#FADBD8';
    else if(grade === this.grades.MODERADO) return '#FCF3CF';
    else return '#D5F5E3';
  }

  filterByState(event: any){
    this.filterState = event;
    const form = this.control.value;

    if( form.from != null){
      this.formateDate();
    }
    if(event !== this.states.TODOS){
      this.dataClone = this.data.filter(p => p.donation === event);
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
    this.data.filter(f =>   moment(f.startDate).isBetween(startDate,isEndDate)) :
    this.data.filter(f => moment(f.startDate).isAfter(startDate));

    console.log('clone data => ',this.dataClone);
  }

  
  formatingAxisX(event: number){
  //   if(typeof event === 'number'){
  //     event = Math.round(event);
  //     console.log('Evento Formating => ', event);
  //     return event;
  //   }
  //  return event;
  }
}
