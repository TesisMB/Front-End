import { StockComponent } from './stock/stock.component';
import { ResourcesListComponent } from './resources-list/resources-list.component';
import { LayoutResourcesComponent } from './layout/layout-resources.component';
import { addEditResourcesComponent } from './add-edit-resources/add-edit-resources.component';
import { ResourcesDetails } from './resources-details/resources-details.component';
import { HistoryRequestComponent } from './history-request/history-request.component';
import { RoleName } from './../models/role';
import { AuthGuard } from './../_helpers/auth.guard';
import { RequestComponent } from './request/request.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourcesComponent } from './resources.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutResourcesComponent,
    children: [
      {
        path: '',
        component: ResourcesComponent,
      },
      {
        path: 'lista/:tipo',
        component: ResourcesListComponent,
      },
      {
        path: 'lista/:tipo/:id',
        component: ResourcesDetails,
      },
      { path: ':action/:tipo',
        component: addEditResourcesComponent,
        canActivate: [AuthGuard],
        data:{ roles: [RoleName.Admin, RoleName.Logistica, RoleName.CoordinadorGeneral]} },
    ],
     
    
  },
  { 
    path: 'solicitudes',
    component: RequestComponent,
    canActivate: [AuthGuard],
    data:{ roles: [RoleName.Admin, RoleName.Logistica, RoleName.CoordinadorGeneral]}
    },

      { path: 'historial',
       component: HistoryRequestComponent },
       { path: 'stock',
       component: StockComponent,
       canActivate: [AuthGuard],
        data:{ roles: [RoleName.Admin, RoleName.Logistica, RoleName.CoordinadorGeneral]} }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResourcesRoutingModule {}
