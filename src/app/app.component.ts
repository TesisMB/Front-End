import { AuthenticationService } from './services';
import { User, RoleName} from './models/index';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef ,Component, OnInit, OnDestroy } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';

interface FoodNode {
  name: string;
  patch?: string,
  icon: string,
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Inicio',
    patch:'/',
    icon:'fas fa-home' ,
  },
  {
    name: 'Empleados',
    patch:'/empleados',
    icon:'fas fa-users' ,
  },
  {
    name: 'Recursos',
    patch: 'recursos',
    icon:'fas fa-first-aid',
    children: [
      {
        name: 'Voluntarios',
        patch:'recursos/voluntarios',
        icon:'fas fa-hands-helping'
      }, {
        name: 'Medicamentos',
        patch:'recursos/medicinas',
        icon:'fas fa-capsules'
      },
      {
        name: 'Materiales',
        patch:'recursos/materiales',
        icon:'fas fa-thermometer'
      },
      {
        name: 'Vehiculos',
        patch:'recursos/vehiculos',
        icon:'fas fa-ambulance'
      },
    ]
  },
  {
    name: 'Emergencias',
    patch:'/emergencias',
    icon:'fas fa-briefcase-medical' ,
  },
  {
    name: 'Alertas',
    patch:'/alertas',
    icon:'fas fa-exclamation-triangle' ,
  },
  {
    name: 'Monitorio',
    patch:'/monitoreo',
    icon:'fas fa-tv' ,
  },
  {
    name: 'Estadisticas',
    patch:'/statistics',
    icon:'fas fa-chart-pie' ,
  },

];

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
treeControl = new NestedTreeControl<FoodNode>(node => node.children);
dataSource = new MatTreeNestedDataSource<FoodNode>();

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
    
    this.dataSource.data = TREE_DATA;

    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
              }
             
              hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
                
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
