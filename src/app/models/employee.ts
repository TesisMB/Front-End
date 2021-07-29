import {User, RoleName} from './index';

export interface Employee {

    employeeID: number;
    users: {
        userDni: string;
    userAvailability?: boolean;
    persons: {
        lastName: string;
        firstName: string;
        phone: string;
        email: string;
        birthdate: number;
        address: string;
        gender: string;
        status: boolean;
    };
    estates?: {
        estateID: number,
        estateTypes: string,
        estatePhone: string,
        locationAddress: {
        locationAddressID: number,
        postalCode: string,
        address: string;
        numberAddress: string;};
        estatesTimes:[{
                    times: { 
                        startTime: number;
                        endTime: number;
                        schedules: {
                        scheduleDate: string;
                        };
                    };
                 }];
                };
    roleName: RoleName;
    token?: string;
    userID?: number;
    UserPassword?: string;
    UserNewPassword?: string;
}
    }
