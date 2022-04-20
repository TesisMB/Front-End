import { EmergencyDisaster } from 'src/app/models/emergencyDisaster';
import { DecimalPipe } from '@angular/common';
import { Resource, ResourcesRequest, ResourcesRequestGet } from ".";
import { UserRequest } from './user';

export  interface Cart{
 
    id: any,
    userID: number,
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
  }

  export interface RequestGet {
    condition: string,
    emergenciesDisasters: EmergencyDisaster,
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