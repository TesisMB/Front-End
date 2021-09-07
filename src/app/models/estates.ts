
export interface Estates {
    estateID?: number;
    estateTypes: string;
    estatePhone: string;
    locationAddress: LocationAddress;
    locations: Location;
    estatesTimes:[{
                times: Times;
             }];
}

export interface LocationAddress {
    locationAddressID: number;
    postalCode: string;
    address: string;
    numberAddress: string;
}

export interface Times {
    startTime: number;
    endTime: number;
    schedules: {
        scheduleDate: string;
    };
}
export interface Location {
    locationID: number;
    locationDepartmentName: string;
    locationMunicipalityName: string;
    locationCityName: string;
    locationLongitude: string;
    locationLatitude: string;
    }
