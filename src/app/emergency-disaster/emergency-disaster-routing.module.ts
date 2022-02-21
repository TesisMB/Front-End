import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutEmergencyDisasterComponent } from './layout-emergency-disaster/layout-emergency-disaster.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutEmergencyDisasterComponent,
    children: [
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmergencyDisasterRoutingModule { }
