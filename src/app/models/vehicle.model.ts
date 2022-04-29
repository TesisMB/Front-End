import { Employee } from '.';
export class Vehicle {
  vehiclePatent: string;
  vehicleYear: string;
  employeeName: string;
  type: string;
  brandName: string;
  fK_BrandID: number;
  fK_EmployeeID: number;
  fK_ModelID: number;
  fk_TypeVehicleID: number;
  modelName: string;
  vehicleUtility: string;
  name?: string;

  constructor(
    _vehiclePatent: string,
    _vehicleYear: string,
    _type: string,
    _employeeName: string,
    _brandName: string,
    _fK_BrandID: number,
    _fK_EmployeeID: number,
    _fK_ModelID: number,
    _fk_TypeVehicleID: number,
    _modelName: string,
    _vehicleUtility: string,
    _name?: string,
  
  ) {
    this.vehiclePatent = _vehiclePatent;
    this.vehicleYear = _vehicleYear;
    this.employeeName = _employeeName;
    this.type = _type;
    this.brandName = _brandName;
    this.fK_BrandID = _fK_BrandID;
    this.fK_EmployeeID =  _fK_EmployeeID;
    this.fK_ModelID =  _fK_ModelID;
    this.fk_TypeVehicleID =  _fk_TypeVehicleID;
    this.modelName = _modelName;
    this.vehicleUtility = _vehicleUtility;
    this.name = _name;
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
