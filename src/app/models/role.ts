export class Role {
  roleID: number;
  RoleName: RoleName;
constructor(_roleID: number, _RoleName:RoleName){
  this.roleID = _roleID;
  this.RoleName = _RoleName;
}  
}


export enum RoleName {
  Admin = 'Admin',
  CoordinadorGeneral = 'Coordinador General',
  CEyD = 'Coordinador de Emergencias y Desastres',
  Logistica = 'Encargado de Logistica',
  Voluntario = 'Voluntario' ,
}

