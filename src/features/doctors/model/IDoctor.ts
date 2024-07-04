import { IPatient } from "../../patients/model/IPatient";

/* 
export interface IDoctor {
    _id: string; 
    name: string;
    specialty: string;
    patients: string[];    
  }
  
   */
export type IDoctor = {
    _id: string; 
    name: string;
    specialty: string;
    //patients: string[];    
    patients: IPatient[];    
  }
  