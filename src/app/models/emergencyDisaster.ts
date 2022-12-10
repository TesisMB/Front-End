import { Victim } from './victim';
import { Material } from './material';
import { Medicine } from './medicine';
import { TypesEmergencyDisaster } from './typeEmergencyDisaster';
import { Vehicle } from './vehicle.model';
import { Alerts } from './alerts';


export interface EmergencyDisaster {

    emergencyDisasterID: number;
    emergencyDisasterStartDate: string;
    emergencyDisasterEndDate: Date;
    emergencyDisasterInstruction: string;
    FK_TypeEmergencyID: number,
    FK_AlertID: number,
    Fk_LocationID: number,
    FK_EstateID: number,
    employeeName: string;
    fk_EmplooyeeID: number,

    locationsEmergenciesDisasters: {
        locationDepartmentName: string;
        locationCityName: string;
        locationMunicipalityName: string;
        locationlatitude: number;
        locationlongitude: number;
    }

    typesEmergenciesDisasters: TypesEmergencyDisaster;

    alerts: Alerts

    employees:{
        name: string;
      employeeID: number;
          userID: number;
          roleName: string;
          userAvailability: boolean;
          userDni: string;
        }

        usersChatRooms:[
        {
            userID: number;
            name: string;
            userDni: string;
            roleName: string;
        },
       ]

     chatRooms:{
         id:number;
         FK_TypeChatRoomID: number;
         dataMessage:[{
            createdDate: string;
                messages: [{
                    ID: number,
                    message: string,
                    messagesState: boolean,
                    createdDate: Date,
                    FK_UserID: number,
                    name: string
                }]
         }]
     }

    resources_Requests: [
            {
                id: number;
                requestDate: string;
                reason: string;
                condition: string;
                resources_RequestResources_Materials_Medicines_Vehicles: [{
                    id: number;
                    fk_Resource_RequestID: number;

                    materials: Material,
                    medicines:Medicine,
                    vehicles: Vehicle
        }]
    }]

    victims: Victim;
    alertName?: string;
    city?: string;
    state?: string;
    type?: string;
}

export interface AlertsInput {
    value: number;
    viewValue: string;
    date?: Date;
  }

 export interface AlertArray {
    disabled?: boolean;
    name: string;
    alerts: AlertsInput[];
  }
