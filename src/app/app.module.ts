import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';

import {MAT_DATE_LOCALE} from '@angular/material/core';


//---- Importaciones internas ----
//******************Modulos ********************** */
import { SharedModule } from './shared/shared.module';
//*****************Components************ */
import { AppComponent } from './app.component';


//**************CLIENT************* */

//***************SERVICES*********** */
import { ErrorInterceptor, JwtInterceptor } from './_helpers';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    SharedModule,
<<<<<<< Updated upstream
    
=======
    MaterialDesignModule,
    ResourcesModule
>>>>>>> Stashed changes
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
<<<<<<< Updated upstream
=======
    AuthenticationService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
>>>>>>> Stashed changes


  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
