import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AddEditComponent, HomeComponent} from './index';

const routes: Routes = [
    {    path: '', component: HomeComponent },
    {
      path: 'perfil',
      component: AddEditComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }
