import { DecimalPipe } from '@angular/common';
import { TableService } from 'src/app/services/_table.service/table.service';
import { MaterialDesignModule } from './../material-design/material-design.module';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersRoutingModule } from './users-routing.module';
import { SharedModule } from './../shared/shared.module';


import { LayoutComponent } from './';
import { ListComponent } from './';
import { RegisterComponent } from './register/register.component';

import { UserService } from './';
import { EmployeesTableComponent } from './employees-table/employees-table.component';
import { SorteableDirective } from '../directives/sorteable.directive';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { UsersReportComponent } from '../shared/users-report/users-report.component';

@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
        UsersRoutingModule,
        MaterialDesignModule
        ],
    declarations: [
        SorteableDirective,
        LayoutComponent,
        ListComponent,
        RegisterComponent,
        EmployeesTableComponent,    ],
    providers: [TableService, UserService, DecimalPipe,
    {provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}}
    ]
})
export class UsersModule { }
