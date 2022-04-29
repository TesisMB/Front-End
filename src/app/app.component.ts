import { Subscription } from 'rxjs';
import { Cart} from 'src/app/models';
import { AuthenticationService } from './services';
import { User, RoleName} from './models/index';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef ,Component, OnInit, OnDestroy } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { ResourcesDetailsService } from './resources/cart/cart.service';
import { FoodNode, Notifications, Notifys, NOTIFY_DATA, TREE_DATA } from './models/navbar.model';

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
        private cartService: ResourcesDetailsService,
    ) {
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
