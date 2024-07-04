import { IMedicine } from "../../medicine/model/IMedicine";
import { IPatient } from "../../patients/model/IPatient";

  export type IDisease ={
    _id: string; 
    name: string;
    description: string;
    patients: IPatient[];
    medicines: IMedicine[];
  }
  
export type IDiseaseDTO = {
  name: string;
  description: string;
  /* patients: string[];
  medicines: string[]; */
};
