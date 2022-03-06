import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { EmergencyDisasterRoutingModule } from '../emergency-disaster-routing.module';
import { LayoutEmergencyDisasterComponent } from './layout-emergency-disaster.component';
import { ListComponent } from '../list/list.component';
import { NgbdModalComponent } from '../ngbd-modal/ngbd-modal.component';
import { NgbdEditDialogComponent } from '../ngbd-edit-dialog/ngbd-edit-dialog.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TableComponent } from '../table/table.component';

@NgModule({
  declarations: [LayoutEmergencyDisasterComponent, ListComponent, NgbdModalComponent, NgbdEditDialogComponent,TableComponent],
  imports: [
    SharedModule,
    EmergencyDisasterRoutingModule
  ],
  providers: [
    NgbActiveModal,
  ],
  exports: []
})
export class EmergencyDisasterModule { }
