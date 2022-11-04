 import {RoleName, Person, Estates} from './index';

 export interface User  {
  userDni: string;
  userAvailability?: boolean;
  createdate: string;
  roleName: RoleName;
  emergencyDisastersReports?: any;
  resourcesRequestReports?: any;
  persons?: Person;
  estates?: Estates
  token?: string;
  userID?: number;
  UserPassword?: string;
  UserNewPassword?: string;
  FK_RoleID: number;
  FK_EstateID: number;
  avatar: string;
 }

 export interface UserRequest {
    userID: number,
    userAvailability: boolean,
    userDni: string,
    roleName: string,
    name: string,
    status: boolean
 }