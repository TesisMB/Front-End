import { AuthenticationService } from './services';
import { User, RoleName} from './models/index';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef ,Component, OnInit, OnDestroy } from '@angular/core';
import { nextTick } from 'process';

@Component({

selector: 'app',
templateUrl: 'app.component.html',
styleUrls: ['app.component.css']
 })
export class AppComponent implements OnDestroy{
currentUser: User;
error:any= "";
handler: any;
mobileQuery: MediaQueryList;
private _mobileQueryListener: () => void;
    constructor(
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private authenticationService: AuthenticationService,
        private router: Router
    ) {
    this.handler = this.authenticationService.currentUser
    .subscribe(x => {this.currentUser = x},
                err => { this.error = err;});
    
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
              }
                    
              get isAdmin() {
    
                return this.currentUser && this.currentUser.roleName === RoleName.Admin || RoleName.CoordinadorGeneral;
            }
          
            get isCoordEyD () {
              return this.currentUser && this.currentUser.roleName === RoleName.CEyD;
            }
          
            get isLogistica () {
              
              return this.currentUser && this.currentUser.roleName === RoleName.Logistica
            }
          
            logout() { 
              this.authenticationService.logout();
           
            }
          
            ngOnDestroy(): void {
              this.handler.unsubscribe();
              this.mobileQuery.removeListener(this._mobileQueryListener);
            }   
}
