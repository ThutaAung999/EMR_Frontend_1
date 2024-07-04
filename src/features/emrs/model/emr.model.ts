import { IDisease } from "../../diseases/model/IDisease";
import { IMedicine } from "../../medicine/model/IMedicine";
import { IPatient } from "../../patients/model/IPatient";



export interface EmrImage {
  image: string;
  tags: string[];
}


  export type IEmr = {
    _id: string; 
    patients: IPatient[];    
    diseases: IDisease[];
    medicines:IMedicine[];
    emrImages:EmrImage[];
    notes:string;
  };

export type IEmrDTO = {
    _id: string; 
    patients: string[];
    diseases: string[];
    medicines: string[];
    emrImages:EmrImage[];
    notes: string;
};