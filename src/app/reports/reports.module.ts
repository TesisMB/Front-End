import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '../shared/shared.module';
import { AlertReportComponent } from './alert-report/alert-report.component';
import { ReportLayoutComponent } from './report-layout/report-layout.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [AlertReportComponent, ReportLayoutComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    SharedModule,
    NgxChartsModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ReportsModule { }
