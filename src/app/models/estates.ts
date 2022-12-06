
export interface Estates {
    estateID?: number;
    estateTypes: string;
    estatePhone: string;
    locationCityName: string;
    postalCode: string;
    address: string;
    numberAddress: string; 
    locationAddressID: number;
    estatesTimes:[{
        scheduleDate: string;
        times: string;
             }];
    locationID?: number;
}
export interface Location {
    locationID: number;
    locationDepartmentName: string;
    locationMunicipalityName: string;
    locationLongitude: string;
    locationLatitude: string;
    locationCityName: string;
    }
