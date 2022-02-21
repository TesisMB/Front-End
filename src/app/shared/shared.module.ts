import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AlertComponent } from './index';
import {NavbarComponent} from './index';
import {NotFoundComponent} from './index';
import { MaterialDesignModule } from '../material-design/material-design.module';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';



@NgModule({
  declarations: [NavbarComponent, NotFoundComponent, AlertComponent, ConfirmModalComponent],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MaterialDesignModule
  ],
  exports: [MaterialDesignModule, NavbarComponent, NgbModule, NotFoundComponent, CommonModule, FormsModule, AlertComponent, ReactiveFormsModule],
})
export class SharedModule { }
