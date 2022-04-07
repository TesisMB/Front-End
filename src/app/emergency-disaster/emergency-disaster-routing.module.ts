import { MapComponent } from './map/map.component';
import { AddEmergencyDisasterComponent } from './add-emergency-disaster/add-emergency-disaster.component';
import { EmergencyDisasterComponent } from './emergency-disaster/emergency-disaster.component';
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
        path: '',
        component: EmergencyDisasterComponent,
      },
      {
        path: 'despliegue/:id',
        component: DeploymentComponent
      },
      {
        path: 'agregar-emergencia-desastre',
        component: AddEmergencyDisasterComponent
      },
      {
        path: 'ubicacion',
        component: MapComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmergencyDisasterRoutingModule { }
