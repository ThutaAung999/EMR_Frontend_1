// src/services/PatientService.ts

import { IPatient } from "../model/IPatient";


export const fetchPatients = async (): Promise<IPatient[]> => {
  console.log("fetchPatients from frontend PatientService");
  
  const response = await fetch('http://localhost:9999/api/patients');
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
