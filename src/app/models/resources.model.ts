import { map } from 'rxjs/operators';
import { Vehicle, Volunteer, Medicine, Material, Estates } from '.';

export class Resource {
  id: string;
  name: string;
  quantity: number;
  availability: boolean;
  locationCityName?:string;
  picture: string;
  description: string;
  medicines: Medicine;
  materials: Material;
  vehicles: Vehicle;
  volunteers: Volunteer;
  estates: Estates;
  donation: boolean;

  constructor(
    _id: string,
    _name: string,
    _quantity: number,
    _availability: boolean,
    _picture: string,
    _description: string,
    _medicines: Medicine,
    _materials: Material,
    _vehicles: Vehicle,
    _volunteers: Volunteer,
    _estates: Estates,
    _donation: boolean,
    _locationCityName?:string,
  

  ) {
    this.id = _id;
    this.name = _name;
    this.quantity = _quantity;
    this.availability = _availability;
    this.picture = _picture;
    this.description = _description;
    this.medicines = _medicines;
    this.materials = _materials;
    this.vehicles = _vehicles;
    this.volunteers = _volunteers;
    this.estates = _estates;
    this.donation = _donation;
    this.locationCityName = _locationCityName;
  }
}

      export interface ResourcesRequest{
        brand: string,
        id: number,
        medicineDrug: string,
        medicineExpirationDate: string,
        medicineLab: string,
        medicineUnits: string,
        medicineWeight: number,
        name: string,
        quantity: number,
        resourceID: number,
        type: string,
        vehiclePatent: string,
        vehicleYear: number
  } 

  export interface ResourcesRequestGet {
    FK_Resource_RequestID: number,
    id: number,
    materials: Material,
    medicines:Medicine,
    vehicles: Vehicle
  }