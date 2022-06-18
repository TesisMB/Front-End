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

@NgModule({
  declarations: [
    AppComponent,
    FileValueAccessorDirective,
    MonitoreoComponent,



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
    EmergencyDisasterModule


  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthenticationService


],
  bootstrap: [AppComponent]
})
export class AppModule { }
