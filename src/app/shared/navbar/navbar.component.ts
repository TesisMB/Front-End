import { User, RoleName} from '../../models/index';
import {MediaMatcher} from '@angular/cdk/layout';
import { AuthenticationService } from '../../services/_authentication/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef ,Component, OnInit, OnDestroy } from '@angular/core';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';


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
   // patch: 'recursos',
    icon:'fas fa-capsules',
    children: [
      {
        name: 'Voluntarios',
        patch:'recursos/request',
        icon:''
      }, {
        name: 'Medicamentos',
        patch:'recursos/medicinas',
        icon:''
      },
      {
        name: 'Materiales',
        patch:'recursos/materiales',
        icon:''
      },
      {
        name: 'Vehiculos',
        patch:'recursos/vehiculos',
        icon:''
      },
    ]
  },
  {
    name: 'Emergencias',
    patch:'/emergencias',
    icon:'fas fa-ambulance' ,
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
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  currentUser: User;
  handler : any;
  private _mobileQueryListener: () => void;
  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();



  constructor(
      changeDetectorRef: ChangeDetectorRef,
      media: MediaMatcher,
      private authenticationService: AuthenticationService,
      private router: Router
      
  ) {
    this.handler = this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.dataSource.data = TREE_DATA;
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit(){
    
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