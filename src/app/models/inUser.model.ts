import {RoleName, Person, Estates} from './index';

export interface InUser  {
        userDni: string;
        userAvailable: boolean;
        roles: {
                roleName: RoleName;
            };
        persons: Person;
        estates: Estates;
    }
