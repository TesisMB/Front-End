import { Injectable, EventEmitter } from '@angular/core';
import { HubConnectionBuilder, HubConnection } from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  hubConnection : HubConnection;
  notificacion : EventEmitter<any> = new EventEmitter();
  constructor() { 

    let builder = new HubConnectionBuilder();
    this.hubConnection = builder.withUrl(environment.URL+'notifications').build();

    this.hubConnection.on("notificar", (mensaje) =>{
      
      console.log(mensaje);
    
      let mje : any =JSON.parse(mensaje);
      this.notificacion.emit(mje);

    });
    this.hubConnection.start();
  }
}
