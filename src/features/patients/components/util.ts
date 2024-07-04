import { IDisease } from "../../diseases/model/IDisease";
import { IDoctor } from "../../doctors/model/IDoctor";
import {IMedicine} from "../../medicine/model/IMedicine";
import {IPatient} from "../../patients/model/IPatient";

export const mapIdsToDiseases = (ids: string[], diseases: IDisease[]): IDisease[] => {
  return ids.map(id => diseases.find(disease => disease._id === id)).filter(disease => disease !== undefined) as IDisease[];
};

export const mapIdsToDoctors = (ids: string[], doctors: IDoctor[]): IDoctor[] => {
  return ids.map(id => doctors.find(doctor => doctor._id === id)).filter(doctor => doctor !== undefined) as IDoctor[];
};

//----------------------
export const mapIdsToMedicines = (ids: string[], medicines: IMedicine[]): IMedicine[] => {
  return ids.map(id => medicines.find(medicine => medicine._id === id)).filter(medicine => medicine !== undefined) as IMedicine[];
};

export const mapIdsToPatients = (ids: string[], patients: IPatient[]): IPatient[] => {
  return ids.map(id => patients.find(patient => patient._id === id)).filter(patient => patient !== undefined) as IPatient[];
};
