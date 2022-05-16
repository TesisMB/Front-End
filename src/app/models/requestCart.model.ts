import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { DecimalPipe } from '@angular/common';
import { Resource, ResourcesRequest, ResourcesRequestGet } from ".";
import { UserRequest } from './user';

export  interface Cart{
 
    id: any,
    userID: number,
    createdBy: number,
    request:[{
      resource: Resource,
      quantity: number,
      error?:string
    }],
    state: boolean,
    createDate: number,
    
  }

  export interface Request{
id: number,
requestDate: string,
reason?: string,
description: string,
status: string,
condition: string,
users:UserRequest,
emergenciesDisasters: EmergencyDisaster,
createdBy: number
  }

  export interface RequestGet {
    condition: string,
    createdByEmployee: string;
    locationDepartmentName: string;
    locationCityName: string;
    locationMunicipalityName: string;
    typeEmergencyDisasterName: string;
    createdBy: number,
    emergencyDisasterID: number;
    id: number,
    reason: string,
    description: string,
    requestDate: string,
    resources_RequestResources_Materials_Medicines_Vehicles: ResourcesRequestGet[],
    status: boolean,
    users: UserRequest
  }

  export interface RequestPost{
    id:number,
    quantity:number,
    resourceID: number,
    name: string,
    medicineExpirationDate: string,
    medinceLab: string,
    medicineDrug: string,
    medicineWeight: DecimalPipe,
    medicineUnits: string,
    brand: string,
    vehiclePatent: string,
    type: string,
    vehicleYear: number

  }