import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ClientHomeComponent } from './';
import {LoginComponent} from './';
import { LayoutComponent } from './../users/layout/layout.component';

const routes: Routes = [
    { path: '', component: LayoutComponent,
      children: [
        { path: '', component: ClientHomeComponent},
        { path: 'login', component: LoginComponent},
        { path: 'recuperar-contraseña', component: ForgotPasswordComponent},
        { path: 'resetear-contraseña', component:ResetPasswordComponent}
      ]
  }
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
