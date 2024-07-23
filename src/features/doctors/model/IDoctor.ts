import { IPatient } from "../../patients/model/IPatient";


export type IDoctor = {
    _id: string; 
    name: string;
    specialty: string;
    //patients: string[];    
    patients: IPatient[];    
  }
  