import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'deployment',
  templateUrl: './deployment.component.html',
  styleUrls: ['./deployment.component.css']
})
export class DeploymentComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log("DEPLOYMEN!!!!!!!!!!!!!!");
  }

}
