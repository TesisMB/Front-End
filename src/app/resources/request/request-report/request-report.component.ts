import { RequestService } from './../request.service';
import { ReportService } from 'src/app/services/_report.service/report.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { RequestGet } from 'src/app/models';
import { map } from 'rxjs/operators';
import { maxParallelImageRequests } from 'mapbox-gl';

interface convertDate {
  day?:string | Date;
  month?:string| Date;
  year?:string| Date;
}
@Component({
  selector: 'request-report',
  templateUrl: './request-report.component.html',
  styleUrls: ['./request-report.component.css']
})
export class RequestReportComponent implements OnInit, OnDestroy {
  originalData: RequestGet[] = [];
  handleService : Subscription;
  handleDate : convertDate[] = [];
  view: [number, number] = [500, 400];
  view2: [number, number] = [1000, 400];
  typeAndYear : any = null;
  // options
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showXAxisLabel: boolean = true;
  yAxisLabel: string = 'Tipos alertas';
  showYAxisLabel: boolean = true;
  showYAxisLabelCity: boolean = true;
  xAxisLabel: string = 'Cantidad';
  yAxisLabelCity: string = 'Ciudad';
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  barChartcustomColors = 
  [
    { name: "Moderado", value: '#C7B42C' },
    { name: "Urgente", value: '#A10A28' },
    { name: "Controlado", value: '#5AA454' },

  ];
  constructor(public service: ReportService, private requestService: RequestService) { }

  ngOnInit(): void {
    this.handleService = this.service.originalData$
                          .pipe(map((data) => {
                            data.forEach(d =>
                              {
                                const [day, month, year] = d.requestDate.split('/');
                                this.handleDate.push({day,month,year});

                              });
                              return data
                            }))
                            .subscribe(data => {
                              this.originalData = data;
                              this.typeAndYear = this.getComplexData(data);
                            console.log('Data original de stock report => ',data);
                            console.log('Date data => ',this.typeAndYear);
                          }, error => {
                            console.error(error);
                          });

  
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
    this.service.BackUpData$ = newData;

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

  ngOnDestroy(){
    this.handleService.unsubscribe();
  }
}
