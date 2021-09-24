import { Employee } from '.';
export class Vehicle {
  vehiclePatent: string;
  utility: string;
  employees: Employee;
  type: TypeVehicle;
  constructor(
    _vehiclePatent: string,
    _utility: string,
    _type: TypeVehicle,
    _employees: Employee
  ) {
    this.vehiclePatent = _vehiclePatent;
    this.utility = _utility;
    this.employees = _employees;
    this.type = _type;
  }
}

export class TypeVehicle {
  type: string;
  mark: string;
  model: string;

  constructor(_type: string, _mark: string, _model: string) {
    this.type = _type;
    this.mark = _mark;
    this.model = _model;
  }
}
