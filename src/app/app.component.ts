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
  role: any[]
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
    role:['Admin','Coordinador General','Coordinador de Emergencias y Desastres', 'Encargado de Logistica']
  },
  {
    name: 'Usuarios',
    patch:'/empleados',
    icon:'fas fa-users' ,
    role:['Admin','Coordinador General'],
    children: [
      {name: 'Registrar usuario',
      patch:'/empleados/registrar',
      icon:'fas fa-user-plus',
      role:['Admin','Coordinador General']
    },]
  },
  {
    name: 'Gestión de recursos',
    patch: 'recursos',
    icon:'fas fa-first-aid',
    role:['Admin','Coordinador General','Encargado de Logistica','Coordinador de Emergencias y Desastres'],
    children: [
      {
        name: 'Voluntarios',
        patch:'/recursos/lista/voluntarios',
        icon:'fas fa-hands-helping',
        role:['Admin','Coordinador General','Encargado de Logistica','Coordinador de Emergencias y Desastres']
      }, {
        name: 'Medicamentos',
        patch:'/recursos/lista/medicamentos',
        icon:'fas fa-capsules',
        role:['Admin','Coordinador General','Encargado de Logistica','Coordinador de Emergencias y Desastres']
      },
      {
        name: 'Materiales',
        patch:'/recursos/lista/materiales',
        icon:'fas fa-thermometer',
        role:['Admin','Coordinador General','Encargado de Logistica','Coordinador de Emergencias y Desastres']
      },
      {
        name: 'Vehiculos',
        patch:'/recursos/lista/vehiculos',
        icon:'fas fa-ambulance',
        role:['Admin','Coordinador General','Encargado de Logistica','Coordinador de Emergencias y Desastres']
      },
 
    ]
  },
  {
    name: 'Solicitudes',
    patch:'/recursos/solicitudes',
    icon:'fas fa-clipboard-list' ,
    role:['Admin','Coordinador General','Encargado de Logistica']
  },
  {
    name: 'Historial de solicitudes',
    patch:'/recursos/historial',
    icon:'fas fa-clipboard-list' ,
    role:['Admin','Coordinador General','Encargado de Logistica']
  },
  {
    name: 'Emergencias o desastres',
    patch:'/emergencias',
    icon:'fas fa-briefcase-medical' ,
    role:['Admin','Coordinador General','Coordinador de Emergencias y Desastres'],
    children: [
      {name: 'Registrar emergencia o desastre',
      patch:'/emergencias/agregar-emergencia-desastre',
      icon:'fas fa-user-plus',
      role:['Admin','Coordinador General']
    },]
  },
  {
    name: 'Monitoreo',
    patch:'/monitoreo',
    icon:'fas fa-tv' ,
    role:['Admin','Coordinador General','Coordinador de Emergencias y Desastres']
  },
  {
    name: 'Estadisticas',
    patch:'/statistics',
    icon:'fas fa-chart-pie' ,
    role:['Admin']
  },

];

@Component({

selector: 'app',
templateUrl: 'app.component.html',
styleUrls: ['app.component.css']
 })
export class AppComponent implements OnInit, OnDestroy{
currentUser: User = null;
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
   // this.dataSource.data = TREE_DATA;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
              }

              ngOnInit(): void {
              this.getCurrentUser();
                  
              }
             
              hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;
                

              get isLogistica () {
                return this.currentUser.roleName === RoleName.Logistica;
               }
               get isRequest(){
                const cart: Cart = JSON.parse(localStorage.getItem('cart'));
                return cart ? cart.request.length : false;
              }
              get data(){
                return this.dataSource.data = TREE_DATA.filter(x => x.role.includes(this.currentUser.roleName));
              }
  

          


            getCurrentUser(){
              this.handler = this.authenticationService.currentUser
              .subscribe((x:User) => {
                this.currentUser = x
              },
              err => { 
                this.error = err;
                console.log(err);
              });
            }

          logout() { 
            this.cartService.clearCartRequest();
            this.authenticationService.logout();
          }

           ngOnDestroy(): void {
            this.handler.unsubscribe();
            this.mobileQuery.removeListener(this._mobileQueryListener);
          }   
}
