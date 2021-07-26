import { User, RoleName} from '../../models/index';
import {MediaMatcher} from '@angular/cdk/layout';
import { AuthenticationService } from '../../services/_authentication/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef ,Component, OnInit, OnDestroy } from '@angular/core';
import { nextTick } from 'process';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  currentUser: User;
  handler : any;
  private _mobileQueryListener: () => void;

  constructor(
      changeDetectorRef: ChangeDetectorRef,
      media: MediaMatcher,
      private authenticationService: AuthenticationService,
      private router: Router
  ) {
    this.handler = this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(){
    
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