import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './resources.component';
import { MedicineComponent } from './medicine/medicine.component';
import { VoluntariesComponent } from './voluntaries/voluntaries.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { MaterialsComponent } from './materials/materials.component';
import { StatesComponent } from './states/states.component';
import { LayoutResourcesComponent } from './layout/layout-resources.component';
import { ResourcesListComponent } from './resources-list/resources-list.component';


@NgModule({
  declarations: [ResourcesComponent, MedicineComponent, VoluntariesComponent, VehiclesComponent, MaterialsComponent, StatesComponent, LayoutResourcesComponent, ResourcesListComponent],
  imports: [
    SharedModule,
    ResourcesRoutingModule
  ]
})
export class ResourcesModule { }
