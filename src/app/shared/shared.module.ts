import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
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
import { ListResourcesComponent } from './list-resources/list-resources.component';



@NgModule({
  declarations: [NavbarComponent, NotFoundComponent, AlertComponent, ConfirmModalComponent, NgbdModalComponent, ResourceModalComponent, ListResourcesComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialDesignModule,
    NgbModule,
  ],
  exports: [MaterialDesignModule, NavbarComponent, NgbModule, NotFoundComponent, CommonModule, FormsModule, AlertComponent, ReactiveFormsModule,ResourceModalComponent],
  providers: [TableService, UserService, DecimalPipe,
    {provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}}
    ]
})
export class SharedModule { }
