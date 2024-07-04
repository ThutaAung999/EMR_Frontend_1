import { IDisease } from "../../diseases/model/IDisease";
import { IDoctor } from "../../doctors/model/IDoctor";

  export type IPatient = {
    _id: string; 
    name: string;
    age: number;
    diseases: IDisease[];
    doctors: IDoctor[];
  };
    
export type IPatientDTO = {
  name: string;
  age: number;
  diseases: string[];
  doctors: string[];
};

