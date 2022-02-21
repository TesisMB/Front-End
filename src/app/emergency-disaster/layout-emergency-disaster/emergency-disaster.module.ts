import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { EmergencyDisasterRoutingModule } from '../emergency-disaster-routing.module';
import { LayoutEmergencyDisasterComponent } from './layout-emergency-disaster.component';
import { ListComponent } from '../list/list.component';
import { NgbdModalComponent } from '../ngbd-modal/ngbd-modal.component';

@NgModule({
  declarations: [LayoutEmergencyDisasterComponent, ListComponent, NgbdModalComponent],
  imports: [
    SharedModule,
    EmergencyDisasterRoutingModule
  ],
  exports: []
})
export class EmergencyDisasterModule { }