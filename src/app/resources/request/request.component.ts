import { Subscription, Observable, pipe } from 'rxjs';
import { RequestService } from './request.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Request, RequestGet } from 'src/app/models/requestCart.model';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit, OnDestroy {
  request : RequestGet[] = [];
  _condition: string = null;
  handleRequest : Subscription;
    constructor(
      private service: RequestService
    ) { }

  ngOnInit(): void {
  }

  set $condition(c){
    this._condition = c;
  }


ngOnDestroy(): void {
}
}
