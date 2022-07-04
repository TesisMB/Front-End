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
    Fk_EmplooyeeID: number;
    FK_TypeEmergencyID: number,
    FK_AlertID: number,
    Fk_LocationID: number,
    FK_EstateID: number,
    
    locationsEmergenciesDisasters: {
        locationDepartmentName: string;
        locationCityName: string;
        locationMunicipalityName: string;
        locationLatitude: number;
        locationLongitude: number;
    }

    typesEmergenciesDisasters: TypesEmergencyDisaster;
    
    alerts: Alerts

    employees:{
      employeeID: number;
          userID: number;
          roleName: string;
          userAvailability: boolean;
          userDni: string;
          name: string;
        }

     chatRooms:{
         id:number;
         FK_TypeChatRoomID: number;
         usersChatRooms:[
         {
             userID: number;
             name: string;
             userDni: string;
             roleName: string;
         },
        ]
        messages: [{
            ID: number,
            message: string,
            messagesState: boolean,
            createdDate: Date,
            FK_UserID: number,
            name: string
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