 import {RoleName, Person, Estates} from './index';

 export interface User  {
  userDni: string;
  userAvailability?: boolean;
  roleName: RoleName;  
  persons?: Person;
  estates?: Estates
  token?: string;
  userID?: number;
  UserPassword?: string;
  UserNewPassword?: string;
 }

 export interface UserRequest {
    userID: number,
    userAvailability: boolean,
    userDni: string,
    roleName: string,
    name: string,
    statis: boolean
 }