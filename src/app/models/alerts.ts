export class Alerts{
    alertID: number;
    alertDegree: AlertDegree;
    alertMessage: AlertDegree;

    
    constructor(_alertID: number,_alertDegree: AlertDegree, _alertMessage: AlertDegree) {
        this.alertID = _alertID;
        this.alertDegree = _alertDegree;
        this.alertMessage = _alertMessage;
    }
}


export enum AlertDegree{
    Controlado = 'Controlado',
    Moderado = 'Moderado',
    Urgente = 'Urgente'
}

