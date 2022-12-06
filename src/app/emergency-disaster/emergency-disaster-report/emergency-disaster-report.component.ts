import { ReportService } from 'src/app/services/_report.service/report.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { EmergencyDisasterService } from '../emergency-disaster.service';

interface AlertsReports {
  emergencyDisasterID: number;
  emergencyDisasterStartDate: Date;
  emergencyDisasterEndDate: Date;
  city: string;
  type: string;
  alertName: string;
  state: string;
  recursos: Recursos;
}

interface Recursos{
  materiales: number; 
  medicamentos: number;
  vehiculos: number
}

enum Condition {
  TODOS = '',
  ACEPTADAS = 'Activa',
  RECHAZADAS = 'Inactiva',
  PENDIENTES = 'Pendiente'
}
interface ReportData{
  name: string;
  value: number;
}

class RecursosReports{
  materiales: {data: ReportData[], selected: boolean};
  medicamentos: {data: ReportData[], selected: boolean};
  vehiculos: {data: ReportData[], selected: boolean};
}
class Reports{
  emergencyDisasterID: {data: ReportData[], selected: boolean};
  emergencyDisasterStartDate: {data: ReportData[], selected: boolean};
  emergencyDisasterEndDate: {data: ReportData[], selected: boolean};
  city: {data: ReportData[], selected: boolean};
  type: {data: ReportData[], selected: boolean};
  alertName: {data: ReportData[], selected: boolean};
  state: {data: ReportData[], selected: boolean};
  recursos: {data: ReportData[], selected: boolean};
  }


@Component({
  selector: 'emergency-disaster-report',
  templateUrl: './emergency-disaster-report.component.html',
  styleUrls: ['./emergency-disaster-report.component.css']
})
export class EmergencyDisasterReportComponent implements OnInit , OnDestroy{
  emergencyDisaster: EmergencyDisaster [];
from: any;
to: any;
view: any[] = [700, 300];
 views: any[] = [500, 300];

  single = [
  {
    "name": "Germany",
    "value": 8940000
  },
  {
    "name": "USA",
    "value": 5000000
  },
  {
    "name": "France",
    "value": 7200000
  },
    {
    "name": "UK",
    "value": 6200000
  }
];

numberCard = [
  {
    "name": "Nª de alertas",
    "value": 250
  },
  {
    "name": "Total de recursos",
    "value": 3000
  },
  {
    "name": "localidades afectadas",
    "value": 725
  },
  {
    "name": "Daños materiales",
    "value": 7500
  },
];

 view3: any[] = [1270, 400];


   view4: any[] = [1210, 150];
  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Ciudad';
  showYAxisLabel: boolean = true;
  // xAxisLabel: string = 'Population';

    // options
    legend: boolean = true;
    animations: boolean = true;
    xAxis: boolean = true;
    yAxis: boolean = true;
    timeline: boolean = true;
    dataClone: AlertsReports[] = null;
    datos: AlertsReports[] = null;
    condition = Condition;
    selected = this.condition.TODOS;
    selectedType: string = "list";
    xAxisLabel: string = 'Cantidad';
    yAxisLabelCity: string = 'Ciudad';
    showYAxisLabelCity: boolean = true;



  filterState: any;
  color = {
    domain: ['#fff', '#fff', '#fff', '#fff', '#fff']
  };


  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA', '#000', '#e35e3f', '#3fa4e2']
  };
  cardColor: string = '#fff';

  reports: Reports = {
    emergencyDisasterID:  {data: null, selected: false},
    emergencyDisasterStartDate:  {data: null, selected: false},
    emergencyDisasterEndDate:  {data: null, selected: false},
    city:  {data: null, selected: false},
    type:  {data: null, selected: false},
    alertName:  {data: null, selected: false},
    state:  {data: null, selected: false},
    recursos:  {data: null, selected: false},

  }

  recursoReports: RecursosReports = {
    materiales:  {data: null, selected: false},
    medicamentos:  {data: null, selected: false},
    vehiculos:  {data: null, selected: false},
  }
        
  constructor(public service : ReportService,
    private emergencyService: EmergencyDisasterService) {
   }

   get isSelected(){
    return !this.reports.city.selected && !this.reports.type.selected && !this.reports.alertName.selected && !this.reports.state.selected;
   }

  ngOnInit(): void {
    //this.getReport();
    // this.getRecursos();
  }

 

//   getReport() {
//     this.emergencyService.getAllReport()

//        .subscribe(data => {
//          this.dataClone = data;
//          this.datos = data;

//          this.service.searchPath = 'alertName';
//          this.service.data = data;
//         //  this.setAll();
//     console.log('EmergencyDisaster - ListAll => ', data);
//    }, error => {
//      console.log('Error', error);
//    })
//  }



 setAll(){
  this.reports.city.data= [...this.dataClone.reduce( (mp, o) => {
    if (!mp.has(o.city)) mp.set(o.city, { name: o.city, value: 0});
    mp.get(o.city).value++;
    return mp;
  }, new Map).values()];

  this.reports.type.data= [...this.dataClone.reduce( (mp, o) => {
    if (!mp.has(o.type)) mp.set(o.type, { name: o.type, value: 0});
    mp.get(o.type).value++;
    return mp;
}, new Map).values()];

this.reports.alertName.data= [...this.dataClone.reduce( (mp, o) => {
  if (!mp.has(o.alertName))  mp.set(o.alertName, { name: o.alertName, value: 0});
  mp.get(o.alertName).value++;
  return mp;
}, new Map).values()];

this.reports.state.data= [...this.dataClone.reduce( (mp, o) => {
  if (!mp.has(o.state))  mp.set(o.state, { name: o.state, value: 0});
  mp.get(o.state).value++;
  return mp;
}, new Map).values()];




}

  onSelect(data): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }

  onActivate(data): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }
  
  // onSelect(event) {
  //   console.log(event);
  // }

  onSelectCity(filter: any): void {
    const f = typeof filter === 'object' ? filter.name : filter;
    console.log('Tipo filtro: ',typeof filter);
    console.log('Item clicked', JSON.parse(JSON.stringify(filter)));
    const citys = this.dataClone.filter(d => d.city === f);
    this.getCitys(citys);
  }

  setVisible(value){
    this.reports.type.selected = value === 'type';
    this.reports.city.selected = value === 'city';
    this.reports.alertName.selected = value === 'alertName';
  }



  getCitys(data){

    this.setVisible('city');  
    this.reports.city.data= [...data.reduce( (mp, o) => {
        if (!mp.has(o.city)) mp.set(o.condition, { name: o.condition, value: 0});
        mp.get(o.condition).value++;
        return mp;
    }, new Map).values()];
    }



 getCondition(data){

    this.setVisible('type');  
    this.reports.type.data= [...data.reduce( (mp, o) => {
        if (!mp.has(o.city)) mp.set(o.condition, { name: o.condition, value: 0});
        mp.get(o.condition).value++;
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
  ngOnDestroy(): void {
    this.service.data = [];
  }
}



