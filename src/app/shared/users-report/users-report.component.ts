import { throwError } from 'rxjs';
// import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';

interface EmergencyDisastersReports {
  id: number;
  city: string;
  type: string;
  state: string;
  degree: string;
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
  type: {data: ReportData[], selected: boolean};
  city: {data: ReportData[], selected: boolean};
  state: {data: ReportData[], selected: boolean};
  degree: {data: ReportData[], selected: boolean};
  }

const ACTIVE = 'Activa';
const INACTIVE = 'Inactiva';

@Component({
  selector: 'app-users-report',
  templateUrl: './users-report.component.html',
  styleUrls: ['./users-report.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class UsersReportComponent implements OnInit {
  view: [number, number] = [700, 350];
  @Input() data: EmergencyDisastersReports[] = null;
  dataClone: EmergencyDisastersReports[] = null;

  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = false;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Tipos alertas';
  showYAxisLabel: boolean = true;
  showYAxisLabelCity: boolean = true;
  xAxisLabel: string = 'Participaciones';
  yAxisLabelCity: string = 'Ciudad';
  showLabels: boolean = true;
  isDoughnut: boolean = true;
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
    type:   {data: null, selected: false},
    city:   {data: null, selected: false},
    state:  {data: null, selected: false},
    degree: {data: null, selected: false},
  }


  control = new FormControl(
    {
      from: null,
      to: null
    },
  );
  filterState: any;

  constructor() { }

  ngOnInit(): void {
     this.dataClone = Object.assign(this.data);
    console.log('Reporte => ',this.reports);
    this.setAll();
    this.control.valueChanges.subscribe(date => {
    this.formateDate();
    console.log('clone data => ',this.dataClone);
    this.setAll();
    });
  }

  get getActiveList(){
    return this.data.filter(p => p.state === ACTIVE);
  }

  get getInactiveList(){
    return this.data.filter(p => p.state === INACTIVE);
  }

  get isSelected(){
   return !this.reports.type.selected && !this.reports.city.selected && !this.reports.degree.selected && !this.reports.state.selected;
  }

  get lstData(){
    return this.dataClone;
  }

  set lstData(filter: any){
  }


  /**
 * @author Matias Roldán
 * @description Metodo que reduce la informaciòn y genera un mapa de valores para generar los reportes 
 * @param data 
 * @return void
 */
 setAll(){
  this.reports.state.data = [...this.dataClone.reduce( (mp, o) => {
    if (!mp.has(o.state)) mp.set(o.state, { name: o.state, value: 0 });
    mp.get(o.state).value++;
    return mp;
  }, new Map).values()];

  this.reports.type.data= [...this.dataClone.reduce( (mp, o) => {
    if (!mp.has(o.type)) mp.set(o.type, { name: o.type, value: 0});
    mp.get(o.type).value++;
    return mp;
}, new Map).values()];

this.reports.city.data= [...this.dataClone.reduce( (mp, o) => {
  if (!mp.has(o.city)) mp.set(o.city, { name: o.city, value: 0});
  mp.get(o.city).value++;
  return mp;
}, new Map).values()];

this.reports.degree.data = [...this.dataClone.reduce( (mp, o) => {
  if (!mp.has(o.degree)) mp.set(o.degree, { name: o.degree, value: 0 });
  mp.get(o.degree).value++;
  return mp;
}, new Map).values()];
}

/**
 * @author Matias Roldán
 * @description Metodo que reduce la informaciòn y genera un mapa de valores para generar el reporte de state 
 * @param data 
 * @return void
 */
 getStates(data){
  this.setVisible('state');  
  this.reports.state.data = [...data.reduce( (mp, o) => {
    if (!mp.has(o.state)) mp.set(o.state, { name: o.state, value: 0 });
    mp.get(o.state).value++;
    return mp;
  }, new Map).values()];
}
/**
 * @author Matias Roldán
 * @description Metodo que de filtrado del reporte de state 
 * @param filter 
 * @return void
 */
onSelectState(filter: any): void {
  const f = typeof filter === 'object' ? filter.name : filter;
  console.log('Tipo filtro: ',typeof filter);
  console.log('Item clicked', JSON.parse(JSON.stringify(filter)));
  const states = this.dataClone.filter(d => d.state === f);
  this.getStates(states);
}
/**
 * @author Matias Roldán
 * @description Metodo que reduce la informaciòn y genera un mapa de valores para generar el reporte de type 
 * @param data 
 * @return void
 */
getType(data){
  this.setVisible('type');  
  this.reports.type.data= [...data.reduce( (mp, o) => {
      if (!mp.has(o.type)) mp.set(o.type, { name: o.type, value: 0});
      mp.get(o.type).value++;
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
 * @description Metodo que reduce la informaciòn y genera un mapa de valores para generar el reporte de city 
 * @param data 
 * @return void
 */
 getCitys(data){

  this.setVisible('city');  
  this.reports.city.data= [...data.reduce( (mp, o) => {
      if (!mp.has(o.city)) mp.set(o.city, { name: o.city, value: 0});
      mp.get(o.city).value++;
      return mp;
  }, new Map).values()];
  }
  /**
 * @author Matias Roldán
 * @description Metodo que de filtrado del reporte de city 
 * @param filter 
 * @return void
 */
   onSelectCity(filter: any): void {
    const f = typeof filter === 'object' ? filter.name : filter;
    console.log('Tipo filtro: ',typeof filter);
    console.log('Item clicked', JSON.parse(JSON.stringify(filter)));
    const citys = this.dataClone.filter(d => d.city === f);
    this.getCitys(citys);
  }
/**
 * @author Matias Roldán
 * @description Metodo que reduce la informaciòn y genera un mapa de valores para generar el reporte de degree 
 * @param data 
 * @return void
 */
 getDegree(data){
  this.setVisible('degree');  
  this.reports.degree.data = [...data.reduce( (mp, o) => {
      if (!mp.has(o.degree)) mp.set(o.degree, { name: o.degree, value: 0 });
      mp.get(o.degree).value++;
      return mp;
  }, new Map).values()];
  }
/**
 * @author Matias Roldán
 * @description Metodo que de filtrado del reporte de degree 
 * @param filter 
 * @return void
 */
  onSelectDegree(filter: any): void {
    const f = typeof filter === 'object' ? filter.name : filter;
    console.log('Tipo filtro: ',typeof filter);
    console.log('Item clicked', JSON.parse(JSON.stringify(filter)));
    const degrees = this.dataClone.filter(d => d.degree === f);
    this.getDegree(degrees);

  } 

  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  setVisible(value){
    this.reports.type.selected = value === 'type';
    this.reports.city.selected = value === 'city';
    this.reports.state.selected = value === 'state';
    this.reports.degree.selected = value === 'degree';
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
      this.dataClone = this.data.filter(p => p.state === event);
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
    if(typeof event === 'number'){
      // event = Math.round(event);
      console.log('Evento Formating => ', event);
      return event % 1 === 0 ? event :  ''; 
    }
   return event;
  }
}
