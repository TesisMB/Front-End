 import {RoleName, Person, Estates} from './index';

 export interface User  {
  userDni: string;
  userAvailability?: boolean;
  persons: Person;
  estates: Estates;
  roleName: RoleName;
  token?: string;
  userID?: number;
  UserPassword?: string;
  UserNewPassword?: string;
 }