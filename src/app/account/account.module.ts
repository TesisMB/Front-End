import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './../shared/shared.module';

import { AccountRoutingModule } from './account-routing.module';
import { AddEditComponent } from './index';
import { HomeComponent } from './index';

import { AuthenticationService } from '../services';


@NgModule({
    imports: [
        SharedModule,
        ReactiveFormsModule,
        AccountRoutingModule
    ],
    declarations: [
        HomeComponent,
        AddEditComponent,

    ],
    providers:[AuthenticationService ]
})
export class AccountModule { }
