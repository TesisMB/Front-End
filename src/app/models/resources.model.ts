import { Vehicle, Volunteer, Medicine, Material, Estates } from '.';

export class Resource {
  id: number;
  name: string;
  quantity: number;
  availability: boolean;
  picture: string;
  description: string;
  medicines: Medicine;
  materials: Material;
  vehicles: Vehicle;
  volunteers: Volunteer;
  estates: Estates;

  constructor(
    _id: number,
    _name: string,
    _quantity: number,
    _availability: boolean,
    _picture: string,
    _description: string,
    _medicines: Medicine,
    _materials: Material,
    _vehicles: Vehicle,
    _volunteers: Volunteer,
    _estates: Estates
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
  }
}