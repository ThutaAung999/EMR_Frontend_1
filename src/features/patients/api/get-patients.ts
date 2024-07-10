// src/services/PatientService.ts

import { IPatient } from "../model/IPatient";


export const fetchPatients = async (): Promise<IPatient[]> => {
  console.log("fetchPatients from frontend PatientService");
  
  const apiUrl = import.meta.env.VITE_API_URL;
  //const response = await fetch('http://localhost:9999/api/patients');
  //const response = await fetch(`https://emr-backend-intz.onrender.com
  const response = await fetch(apiUrl+`api/patients`);
  
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
