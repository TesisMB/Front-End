import {User, RoleName, Estates} from './index';

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
    estates?: Estates;
    roleName: RoleName;
    token?: string;
    userID?: number;
    UserPassword?: string;
    UserNewPassword?: string;
}
    }
