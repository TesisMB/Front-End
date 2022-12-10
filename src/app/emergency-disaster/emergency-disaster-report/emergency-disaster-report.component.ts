import { ReportService } from 'src/app/services/_report.service/report.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { EmergencyDisasterService } from '../emergency-disaster.service';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

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

  interface convertDate {
    day?:string | Date;
    month?:string| Date;
    year?:string| Date;
    startDate?:string| Date;
    endDate?:string| Date;
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
originalData: EmergencyDisaster[] = [];
handleService : Subscription;
handleDate : convertDate[] = [];
view: [number, number] = [500, 400];
view2: [number, number] = [1000, 400];
typeAndYear : any = null;
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
  barChartcustomColors = 
  [
    { name: "Moderado", value: '#C7B42C' },
    { name: "Urgente", value: '#A10A28' },
    { name: "Controlado", value: '#5AA454' },

  ];
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
    this.handleService = this.service.originalData$
    .pipe(map((data) => {
      data.forEach(d =>
        {
          var startDate = new Date(d.emergencyDisasterStartDate);
          if(d.emergencyDisasterEndDate){
            var endDate = new Date(d.emergencyDisasterEndDate);
          }
          // const [day, month, year] = d.emergencyDisasterStartDate.split('/');
           this.handleDate.push({startDate,endDate});
          
        });
        return data
      }))
      .subscribe(data => {
        this.originalData = data;
        // this.typeAndYear = this.getComplexData(data);
      console.log('Data original de stock report => ',data);
      // console.log('Date data => ',this.typeAndYear);
    }, error => {
      console.error(error);
    });
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


    get day(){
      return [...this.handleDate.reduce((mp, o) => {
        if (!mp.has(o.day))
        mp.set(o.day, { name: o.day, value: 0 })
        mp.get(o.day).value++;
        return mp;
    }, new Map())
    .values()
    ];
    }
    get month(){
      return [...this.handleDate.reduce((mp, o) => {
        if (!mp.has(o.month))
        mp.set(o.month, { name: o.month, value: 0 })
        mp.get(o.month).value++;
        return mp;
    }, new Map())
    .values()
    ];
    }
    get year(){
      return [...this.handleDate.reduce((mp, o) => {
        if (!mp.has(o.year))
        mp.set(o.year, { name: o.year, value: 0 })
        mp.get(o.year).value++;
        return mp;
    }, new Map())
    .values()
    ];
    }
    
    
    getComplexData(data){
      return [... data.reduce((pv, cv) => {
        const currentYear =this.convertYear(cv.requestDate);
        if(!pv.has(cv.typeEmergencyDisasterName))
        {
          pv.set(cv.typeEmergencyDisasterName,
            {name: cv.typeEmergencyDisasterName,
            series: [{name: currentYear, value: 0}]});
        }
          pv.get(cv.typeEmergencyDisasterName).series
          .map(d => {
            d.name === currentYear ? d.value++ : pv.get(cv.typeEmergencyDisasterName).series.push({name: currentYear, value: 1});
            //   pv.get(cv.typeEmergencyDisasterName).series.map(x => if(x.name.equals(currentYear)))
          });
        
        return pv;
      }, new Map()).values()];
    }
    
      onSelect(data: string | any, path: string): void {
        console.log({data,path});
        // const complexData = this.getComplexData();
        // console.log('complex data=> ',complexData);
    
        data = this.formatingFilterData(data,path);
        if(path.includes('.')){
          var subStr = path.split('.');
        }  
        let newData = this.originalData.filter((d, o) => {
        if(subStr){
          return d[subStr[0]][subStr[1]] === data;
        }  else {
          return d[path] == data;
        }
        });
        this.service.data = newData;
        // this.requestService. = newData;
        console.log(newData);
      }
    
      formatingFilterData(data: any, path: string): any {
        if(path.includes('donation') || path.includes('availability')){
          data = !data.includes('no');  
        }else if(path.includes('.')){
          let subStr = path.split('.');
        }
        return data;
      }
    
      convertYear(date){
        const [day, month, year] = date.split('/');
    
        return year;
      }
    
      onSelectComplex(event){
        console.log('On Select Complex Data => ',event);
      }
  ngOnDestroy(): void {
    // this.service.data = [];
  }
}



