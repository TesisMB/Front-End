import { Employee } from '.';
export class Vehicle {
  vehiclePatent: string;
  utility: string;
  employees: Employee;
  type: TypeVehicle;
  brandsModels: BrandsModels;
  constructor(
    _vehiclePatent: string,
    _utility: string,
    _type: TypeVehicle,
    _employees: Employee,
    _brandsModels: BrandsModels

  ) {
    this.vehiclePatent = _vehiclePatent;
    this.utility = _utility;
    this.employees = _employees;
    this.type = _type;
    this.brandsModels = _brandsModels;
  }
}

export class TypeVehicle {
  type: string;


  constructor(_type: string) {
    this.type = _type;
  }
}

export class BrandsModels{
id: number;
marks: string;
model: Model;
  constructor(_id: number, _marks: string, _model: Model){
    this.id = _id;
    this.marks = _marks;
    this.model = _model;
  }
}
export class Model {
  id: number;
  modelName: string;
    constructor(_id:number, _modelName: string){
      this.id = _id;
      this.modelName = _modelName;
    }
}
