import { Subscription } from 'rxjs';
import { Cart} from 'src/app/models';
import { AuthenticationService } from './services';
import { User, RoleName, Material, Vehicle, Medicine} from './models/index';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef ,Component, OnInit, OnDestroy } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ResourcesDetailsService } from './resources/cart/cart.service';

interface FoodNode {
  name: string,
  patch?: any,
  icon: string,
  children?: FoodNode[],
}



interface Notifications{
  hasNotifications: boolean,
  number: number
}
interface Notifys{
 
      id: number,
      message: string,
      state: boolean,
      createDate: string,
      url: string
}
const NOTIFY_DATA: Notifys[] = [
  {
    id: 1,
    message: 'Esta es una notificacion',
    state: true,
    createDate: '15-11-2021',
    url: null
  },
  {
    id: 2,
    message: 'Esta es la segunda notificacion',
    state: true,
    createDate: '14-11-2021',
    url: null
  },
   {
    id: 3,
    message: 'Esta es la 3ra notificacion',
    state: false,
    createDate: '13-11-2021',
    url: null
  }
];

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
        patch:'/recursos/lista/voluntarios',
        icon:'fas fa-hands-helping'
      }, {
        name: 'Medicamentos',
        patch:'/recursos/lista/medicamentos',
        icon:'fas fa-capsules'
      },
      {
        name: 'Materiales',
        patch:'/recursos/lista/materiales',
        icon:'fas fa-thermometer'
      },
      {
        name: 'Vehiculos',
        patch:'/recursos/lista/vehiculos',
        icon:'fas fa-ambulance'
      },
      {
        name: 'Solicitudes',
        patch:'/recursos/solicitudes',
        icon:'fas fa-clipboard-list' ,
      },
    ]
  },
  {
    name: 'Emergencias',
    patch:'/emergencias',
    icon:'fas fa-briefcase-medical' ,
  },
  {
    name: 'Monitoreo',
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
handler: Subscription;
request = null;
notifications: Notifications = {hasNotifications: true, number:22};
mobileQuery: MediaQueryList;
treeControl = new NestedTreeControl<FoodNode>(node => node.children);
dataSource = new MatTreeNestedDataSource<FoodNode>();
notifys: Notifys[] = NOTIFY_DATA;


private _mobileQueryListener: () => void;
    constructor(
        changeDetectorRef: ChangeDetectorRef,
        media: MediaMatcher,
        private authenticationService: AuthenticationService,
        private router: Router,
        private cartService: ResourcesDetailsService,
        private route: ActivatedRoute
    ) {
    this.getCurrentUser();
    this.dataSource.data = TREE_DATA;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
              }
             
              hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
                

          
            logout() { 
              this.cartService.clearCartRequest();
              this.authenticationService.logout();
            }
          
            ngOnDestroy(): void {
              this.handler.unsubscribe();
              this.mobileQuery.removeListener(this._mobileQueryListener);
            }   

            getCurrentUser(){
              this.handler = this.authenticationService.currentUser
              .subscribe(x => {this.currentUser = x},
                          err => { this.error = err;});
            }
            get isRequest(){
              const cart: Cart = JSON.parse(localStorage.getItem('cart'));
              return cart ? cart.request.length : false;
            }

          // get isAdmin() {
                
          //     return this.currentUser && this.currentUser.roleName === RoleName.Admin || RoleName.CoordinadorGeneral;
          // }
        
          // get isCoordEyD () {
          //   return this.currentUser && this.currentUser.roleName === RoleName.CEyD;
          // }
        
          // get isLogistica () {
            
          //   return this.currentUser && this.currentUser.roleName === RoleName.Logistica
          // }
}
