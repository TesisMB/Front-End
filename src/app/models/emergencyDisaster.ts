

export interface EmergencyDisaster {

    emergencyDisasterID: number;
    emergencyDisasterStartDate: string;
    emergencyDisasterEndDate: string;
    emergencyDisasterInstruction: string;

    locations: {
        locationDepartmentName: string;
        locationCityName: string;
        locationMunicipalityName: string
    }

    typesEmergenciesDisasters: {
        typeEmergencyDisasterID: number;
        typeEmergencyDisasterName: string;
        typeEmergencyDisasterIcon: string;
        typeEmergencyDisasterDescription: string;
    }

    alerts: {
        alertID: number;
        alertMessage: string;
        alertDegree: string;
    }

    employees:{
      employeeID: number;
      users:{
          userID: number;
          roleName: string;
          userAvailability: boolean;
          userDni: string;
          persons:{
            firstName: string;
            lastName: string;
            status: string;
          }
        }
    }

}
