import { DeploymentComponent } from './deployment/deployment.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutEmergencyDisasterComponent } from './layout-emergency-disaster/layout-emergency-disaster.component';

import { ListComponent } from '../../app/emergency-disaster/list/list.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutEmergencyDisasterComponent,
    children: [
      {
        path: 'detalles',
        component: DeploymentComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmergencyDisasterRoutingModule { }
