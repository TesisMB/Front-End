import { Estates } from "./estates";

export class Medicine {
    medicineID: number;
    medicineName: string;
    medicineQuantity: number;
    medicineExpirationDate: string;
    medicineLab: string;
    medicineDrug: string;
    medicineWeight: number;
    medicineUnits: string;
    medicineUtility: string;
    medicineAvailability : boolean;
    estates: Estates;

    constructor ( _medicineID: number,
        _medicineName: string,
        _medicineQuantity: number,
        _medicineExpirationDate: string,
        _medicineLab: string,
        _medicineDrug: string,
        _medicineWeight: number,
        _medicineUnits: string,
        _medicineUtility: string,
        _medicineAvailability : boolean,
        _estates: Estates){

            this.medicineID= _medicineID;
           this.medicineName=_medicineName;
           this.medicineQuantity=_medicineQuantity;
           this.medicineExpirationDate=_medicineExpirationDate;
           this.medicineLab=_medicineLab;
           this.medicineDrug=_medicineDrug;
           this.medicineWeight=_medicineWeight;
           this.medicineUnits=_medicineUnits;
           this.medicineUtility=_medicineUtility;
           this.medicineAvailability=_medicineAvailability;
           this.estates=_estates;
        }
}