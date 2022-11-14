import { ResourcesService } from './resources.service';
import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './resources.component';
import { HistoryRequestComponent } from './history-request/history-request.component';
import { RequestComponent } from './request/request.component';
import { addEditResourcesComponent } from './add-edit-resources/add-edit-resources.component';
import { ResourcesDetails } from './resources-details/resources-details.component';
import { StatesComponent } from './states/states.component';
import { LayoutResourcesComponent } from './layout/layout-resources.component';
import { ResourcesListComponent } from './resources-list/resources-list.component';
import { CartComponent } from './cart/cart.component';
import { RequestTableComponent } from './request-table/request-table.component';
import { StockComponent } from './stock/stock.component';
import { StockTableComponent } from './stock/stock-table/stock-table.component';
import { NgbdResourcesFiltersDialogComponentComponent } from './ngbd-resources-filters-dialog-component/ngbd-resources-filters-dialog-component.component';
import { StockReportComponent } from './stock/stock-report/stock-report.component';


@NgModule({
  declarations: [ResourcesComponent, HistoryRequestComponent, RequestComponent, addEditResourcesComponent, ResourcesDetails, StatesComponent, LayoutResourcesComponent, ResourcesListComponent, CartComponent, RequestTableComponent, StockComponent, StockTableComponent, NgbdResourcesFiltersDialogComponentComponent, StockReportComponent],
  imports: [
    SharedModule,
    ResourcesRoutingModule
  ],
  exports: [CartComponent, ResourcesListComponent],
  // providers: [ResourcesService]
})
export class ResourcesModule { }
