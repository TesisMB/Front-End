import { ResourcesComponent } from './../resources/resources.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertReportComponent } from './alert-report/alert-report.component';
import { ReportLayoutComponent } from './report-layout/report-layout.component';
import { ResourcesRequestReportComponent } from '../users/report-resources-request/resources-request-report/resources-request-report.component';


const routes: Routes = [
  {
    path: '',
    component: ReportLayoutComponent,
    children: [
      {
        path: '',
        component: AlertReportComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
