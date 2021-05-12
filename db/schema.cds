namespace desafio.final;

using {cuid} from '@sap/cds/common';

entity Departments : cuid {
    name    : String;
    manager : Association to Employees;
}

entity Employees : cuid {
    firstname            : String;
    lastname             : String;
    birthDate            : Date;
    email                : String;
    groupRisk            : Boolean;
    livesRiskGroup       : Boolean;
    publicTransport      : Boolean;
    hourPublicTransport  : Boolean;
    environmentEquipment : Boolean;
    department           : Association to Departments;
}
