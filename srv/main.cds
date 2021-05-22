using { desafio.final as my } from '../db/schema';

service MainService {
  entity Employees as projection on my.Employees;
  entity Departments as projection on my.Departments;
  
  action updateManyEmployees(employees: array of Employees );
}