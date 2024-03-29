import { ReportsModule } from './reports/reports.module';
import { EmergencyDisasterModule } from './emergency-disaster/layout-emergency-disaster/emergency-disaster.module';
import { ResourcesModule } from './resources/resources.module';
import { AuthenticationService } from './services/_authentication/authentication.service';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';


//import { AgmCoreModule } from '@agm/core';


//---- Importaciones internas ----
//******************Modulos ********************** */
import { SharedModule } from './shared/shared.module';
import { MaterialDesignModule } from './material-design/material-design.module';
//*****************Components************ */
import { AppComponent } from './app.component';


//**************CLIENT************* */

//***************SERVICES*********** */
import { ErrorInterceptor, JwtInterceptor} from './_helpers';
import { FileValueAccessorDirective } from './directives/file-value-accessor.directive';
import { MonitoreoComponent } from './monitoreo/monitoreo/monitoreo.component';
import { DialogPDFComponent } from './monitoreo/dialog-pdf/dialog-pdf.component';
import { MonitorioListComponent } from './monitoreo/monitorio-list/monitorio-list.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { MomentModule } from 'ngx-moment';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

@NgModule({
  declarations: [
    AppComponent,
    FileValueAccessorDirective,
    MonitoreoComponent,
    DialogPDFComponent,
    MonitorioListComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialDesignModule,
    ResourcesModule,
    ReportsModule,
    MomentModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoicGxheWVyMDA3IiwiYSI6ImNsOXAyeG1sNTA2dWkzb20zdGZlZXltN3kifQ.Go27DcgWemsSmSr8gWg5Aw', // Optional, can also be set per map (accessToken input of mgl-map)
    })

  ],

  //AIzaSyA_CKkvt8BfYaEsSp0AHiJVwD_KB5G2Pa4
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthenticationService


],
  bootstrap: [AppComponent]
})
export class AppModule { }
