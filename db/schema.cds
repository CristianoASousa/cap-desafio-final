namespace desafio.final;

using {cuid} from '@sap/cds/common';

entity Departments {
    key ID      : Integer;
        name    : String;
        manager : String;
}

entity Employees : cuid {
    name                 : String;
    birthDate            : Date;
    email                : String;
    groupRisk            : Boolean;
    livesRiskGroup       : Boolean;
    publicTransport      : Boolean;
    hourPublicTransport  : Boolean;
    environmentEquipment : Boolean;
    department           : Association to Departments;
    inHomeOffice         : Boolean;
    vaccinated           : Boolean;
    score                : Integer;
    gotCOVID             : Boolean;
    activeCase           : Boolean;
    contaminationDate    : Date;
}
