import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AlertReportComponent } from './alert-report/alert-report.component';
import { ReportLayoutComponent } from './report-layout/report-layout.component';

@NgModule({
  declarations: [AlertReportComponent, ReportLayoutComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
  ]
})
export class ReportsModule { }
