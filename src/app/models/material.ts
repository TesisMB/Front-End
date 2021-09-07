import { Estates } from "./estates";

export class Material {

    materialID: number;
    materialName: string;
    materialMark: string;
    materialQuantity: number;
    materialAvailability: boolean;
    materialPicture: string;
    estates: Estates;

    constructor(_materialID: number, _materialName: string, _materialMark: string,
                 _materialQuantity: number, _materialAvailability: boolean,
                _materialPicture: string, _estates: Estates){

    this.materialID = _materialID;
    this.materialName = _materialName;
    this.materialMark = _materialMark;
    this.materialQuantity = _materialQuantity;
    this.materialAvailability = _materialAvailability;
    this.materialPicture = _materialPicture;
    this.estates = _estates;



    }
}

