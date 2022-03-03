import { AuthenticationService } from 'src/app/services';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-states',
  templateUrl: './states.component.html',
  styleUrls: ['./states.component.css']
})
export class StatesComponent implements OnInit {

  constructor(
    private authService: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  get role(){
  const roleName = this.authService.currentUserValue.roleName;
    return (roleName === 'Encargado de Logistica');
  }

}
