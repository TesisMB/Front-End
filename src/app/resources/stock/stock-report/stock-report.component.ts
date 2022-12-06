import { throwError, Subscription } from 'rxjs';
// import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ResourcesService } from '../../resources.service';
import { ReportService } from 'src/app/services/_report.service/report.service';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ReportModalComponent } from 'src/app/shared/report-modal/report-modal.component';

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
  path?: string;
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
export class StockReportComponent implements OnInit, OnDestroy {
  originalData: any = null;
  handleService : Subscription;
  view: [number, number] = [500, 400];
  view2: [number, number] = [1000, 400];
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

  constructor(public resourceService: ResourcesService, public service: ReportService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.handleService = this.service.originalData$
                          // .pipe(map(() => {
                          // }))
                          .subscribe(data => {
                            this.originalData = data;
                            console.log('Data original de stock report => ',data);
                          }, error => {
                            console.error(error);
                          });
  }

  onSelect(data: string | any, path: string): void {
    console.log({data,path});
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
    this.resourceService._resources = newData;
    console.log(newData);
  }
  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  formatingFilterData(data: any, path: string): any {
    if(path.includes('donation') || path.includes('availability')){
      data = !data.includes('no');  
    }else if(path.includes('.')){
      let subStr = path.split('.');
    }
    return data;
  }
  formatingAxisX(event: number){
  //   if(typeof event === 'number'){
  //     event = Math.round(event);
  //     console.log('Evento Formating => ', event);
  //     return event;
  //   }
  //  return event;
  }
  
  openDialog(type: string) {
    this.dialog.open(ReportModalComponent, {
      data: {
        animal: 'panda'
      }
    });
  }
  ngOnDestroy(){
    this.handleService.unsubscribe();
  }
}
