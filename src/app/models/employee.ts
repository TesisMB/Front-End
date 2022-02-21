import { Location } from './estates';
import {User, RoleName, Estates} from './index';

export interface Employee {

    employeeID: number;
    employeeCreatedate?: string;
    users: {
        userDni: string;
    userAvailability?: boolean;
    persons: {
        lastName: string;
        firstName: string;
        phone: string;
        email: string;
        birthdate: string;
        address: string;
        gender: string;
        status: boolean;
    };
    locations: Location;
    estates?: Estates;
    roleName: RoleName;
    userID?: number;
    token?: string;
    UserPassword?: string;
    UserNewPassword?: string;
}
    }
