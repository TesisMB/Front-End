import { TypesEmergencyDisaster } from './typeEmergencyDisaster';


export interface EmergencyDisaster {

    emergencyDisasterID: number;
    emergencyDisasterStartDate: string;
    emergencyDisasterEndDate: string;
    emergencyDisasterInstruction: string;

    locations: {
        locationDepartmentName: string;
        locationCityName: string;
        locationMunicipalityName: string;
        locationLatitude: number;
        locationLongitude: number;

    }

    typesEmergenciesDisasters: TypesEmergencyDisaster;
    
    alerts: {
        alertID: number;
        alertMessage: string;
        alertDegree: string;
    }

    employees:{
      employeeID: number;
          userID: number;
          roleName: string;
          userAvailability: boolean;
          userDni: string;
          name: string;
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
                
                    materials:{
                        id: number;
                        quantity: number;
                        name: string;
                        brand: string;
            }
        }]
    }]
}
