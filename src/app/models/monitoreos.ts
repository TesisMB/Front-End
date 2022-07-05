export interface Files {
    id: number,
    createDate: string,
    location: string,
    locationFile: string,
    pdfDateModified: string,
    createdBy: number,
    modifiedBy: number,
    createdByEmployee: string,
    modifiedByEmployee: string,
    emergenciesDisasters: {
        emergencyDisasterID: number,
        emergencyDisasterStartDate: string,
        emergencyDisasterEndDate: string,
        typesEmergenciesDisasters: {
            typeEmergencyDisasterID: number,
            typeEmergencyDisasterName: string,
            typeEmergencyDisasterIcon: string,
        },
    locationsEmergenciesDisasters: {
        locationDepartmentName: string,
        locationMunicipalityName: string,
        locationCityName: string,
        locationlongitude: number,
        locationlatitude: number
    },
    alerts: {
        alertID: number,
        alertMessage: string,
        alertDegree: string,
        
    }
    }
}