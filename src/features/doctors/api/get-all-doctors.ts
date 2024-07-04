import { useQuery } from "@tanstack/react-query";
import { IDoctor } from "../model/IDoctor";
import { IPatient } from "../../patients/model/IPatient";

// Fetch doctors

const fetchDoctors = async (): Promise<IDoctor[]> => {
  const response = await fetch("http://localhost:9999/api/doctors");
  if (!response.ok) {
    throw new Error("Failed to fetch doctors");
  }
  return response.json();
};
  
  export const useGetDoctors = () => {
    return useQuery<IDoctor[], Error>({
        queryKey: ['doctors'],
        queryFn: fetchDoctors,
        refetchOnWindowFocus: false,
    });
};

/* 
export const useFetchDoctors = () => {
  return useQuery<IDoctor[], Error>(["doctors"], fetchDoctors);
}; */