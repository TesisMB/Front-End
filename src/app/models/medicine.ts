
export class Medicine {
  medicineExpirationDate: string;
  medicineLab: string;
  medicineDrug: string;
  medicineWeight: number;
  medicineUnits: string;

  constructor(
    _medicineExpirationDate: string,
    _medicineLab: string,
    _medicineDrug: string,
    _medicineWeight: number,
    _medicineUnits: string
  ) {
    this.medicineExpirationDate = _medicineExpirationDate;
    this.medicineLab = _medicineLab;
    this.medicineDrug = _medicineDrug;
    this.medicineWeight = _medicineWeight;
    this.medicineUnits = _medicineUnits;
  }
}
