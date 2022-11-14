import { RouterModule} from '@angular/router';
import { NgModule,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AlertComponent } from './index';
import {NavbarComponent} from './index';
import {NotFoundComponent} from './index';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { NgbdModalComponent } from '../users/ngbd-modal/ngbd-modal.component';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { TableService } from '../services/_table.service/table.service';
import { UserService } from '../users/user.service';
import { ResourceModalComponent } from './resource-modal/resource-modal.component';
import { CredentialComponent } from './credential/credential.component';
import { ListResourcesComponent } from './list-resources/list-resources.component';
import { RecentAlertComponent } from './recent-alert/recent-alert.component';
import { RecentHistoryComponent } from './recent-history/recent-history.component';
import { RecentMonitoreoComponent } from './recent-monitoreo/recent-monitoreo.component';
import { RecentNoStockComponent } from './recent-no-stock/recent-no-stock.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { UsersReportComponent } from './users-report/users-report.component';
import { DatePickerRangeComponent } from '../directives/date-picker-range/date-picker-range';
import { ResourcesRequestReportComponent } from '../users/report-resources-request/resources-request-report/resources-request-report.component';
import { ResourcesRequestViewComponent } from '../users/report-resources-request/resources-request-view/resources-request-view.component';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FilterComponent } from './filter/filter.component';
import { EmergencyDisasterReportComponent } from '../emergency-disaster/emergency-disaster-report/emergency-disaster-report.component';
import { EmergencyDisasterFilterComponent } from '../emergency-disaster/emergency-disaster-filter/emergency-disaster-filter.component';


@NgModule({
  declarations: [
    NavbarComponent,
    NotFoundComponent,
    AlertComponent,
    ConfirmModalComponent,
    NgbdModalComponent,
    ResourceModalComponent,
    ListResourcesComponent,
    CredentialComponent, 
    RecentAlertComponent, 
    RecentHistoryComponent,
    RecentMonitoreoComponent,
    RecentNoStockComponent,
    UsersReportComponent,
    ResourcesRequestReportComponent,
    ResourcesRequestViewComponent,
    DatePickerRangeComponent,
    FilterComponent,
    EmergencyDisasterReportComponent,
    EmergencyDisasterFilterComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    NgbModule,
    NgxChartsModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [
    MaterialDesignModule,
    CredentialComponent,
    RecentMonitoreoComponent,
    RecentHistoryComponent,
    RecentAlertComponent, 
    NavbarComponent,
    NgbModule, 
    NotFoundComponent,
    CommonModule,
    FormsModule,
    AlertComponent,
    ReactiveFormsModule,
    ResourceModalComponent,
    UsersReportComponent,
    ResourcesRequestReportComponent,
    ResourcesRequestViewComponent,
    NgxChartsModule,
    FilterComponent,
    EmergencyDisasterReportComponent,
    EmergencyDisasterFilterComponent
  ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    TableService,
    UserService,
    DecimalPipe,
    {provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}}
    ]
})
export class SharedModule { }
