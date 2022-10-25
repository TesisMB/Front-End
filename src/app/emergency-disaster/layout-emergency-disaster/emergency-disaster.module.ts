import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { EmergencyDisasterRoutingModule } from '../emergency-disaster-routing.module';
import { LayoutEmergencyDisasterComponent } from './layout-emergency-disaster.component';
import { ListComponent } from '../list/list.component';
import { NgbdModalComponent } from '../ngbd-modal/ngbd-modal.component';
import { NgbdEditDialogComponent } from '../ngbd-edit-dialog/ngbd-edit-dialog.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from '../table/table.component';
import { NgbdDeleteModalComponent } from '../ngbd-delete-modal/ngbd-delete-modal.component';
import { AddEmergencyDisasterComponent } from '../add-emergency-disaster/add-emergency-disaster.component';
import { DeploymentComponent } from '../deployment/deployment.component';
import { EmergencyDisasterComponent } from '../emergency-disaster/emergency-disaster.component';
import { MapComponent } from '..//map/map.component';
import { LoadingComponent } from '../loading/loading.component';
import { MapViewComponent } from '../map-view/map-view.component';
import { BtnMyLocationComponent } from '../btn-my-location/btn-my-location.component';
import { AngularLogoComponent } from '../angular-logo/angular-logo.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SearchResultComponent } from '../search-result/search-result.component';
import {GoogleMapsModule} from '@angular/google-maps';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

@NgModule({
  declarations: [LayoutEmergencyDisasterComponent, ListComponent, NgbdModalComponent, 
    NgbdEditDialogComponent,TableComponent, 
    NgbdDeleteModalComponent, MapComponent,
    AddEmergencyDisasterComponent, DeploymentComponent, 
    EmergencyDisasterComponent, LoadingComponent, MapViewComponent,
    AngularLogoComponent, BtnMyLocationComponent,
    SearchBarComponent, SearchResultComponent],
  imports: [
    SharedModule,
    EmergencyDisasterRoutingModule,
    // GoogleMapsModule,
    // GooglePlaceModule
  ],
  providers: [
    NgbActiveModal,
  ],
  exports: []
})
export class EmergencyDisasterModule { }
