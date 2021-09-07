import { LayoutResourcesComponent } from './layout/layout-resources.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { MaterialsComponent } from './materials/materials.component';
import { MedicineComponent } from './medicine/medicine.component';
import { RoleName } from './../models/role';
import { AuthGuard } from './../_helpers/auth.guard';
import { VoluntariesComponent } from './voluntaries/voluntaries.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourcesComponent } from './resources.component';

const routes: Routes = [
  { 
     path: '',
     component: LayoutResourcesComponent,
     children:[
       {
         path: '',
         component: ResourcesComponent
       },
     
      { 
      path: 'voluntarios',
      component: VoluntariesComponent,
      canActivate:[AuthGuard],
      data: {roles: [RoleName.CoordinadorGeneral,RoleName.Admin]}},
 { 
      path: 'medicamentos',
      component: MedicineComponent},
  {   
     path: 'materiales',
     component: MaterialsComponent
},
{     path: 'vehiculos',
      component: VehiclesComponent
    }]}
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ResourcesRoutingModule { }
