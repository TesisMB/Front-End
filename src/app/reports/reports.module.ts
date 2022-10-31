import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AlertReportComponent } from './alert-report/alert-report.component';
import { ReportLayoutComponent } from './report-layout/report-layout.component';
import { UsersReportComponent } from './users-report/users-report.component';
import { ResourcesRequestReportComponent } from '../users/report-resources-request/resources-request-report/resources-request-report.component';
@NgModule({
  declarations: [AlertReportComponent, ReportLayoutComponent, UsersReportComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReportsModule { }
