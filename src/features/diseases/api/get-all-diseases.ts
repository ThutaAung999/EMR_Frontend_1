import { useQuery } from "@tanstack/react-query";
import { IDisease } from "../model/IDisease";

// Fetch diseases
const fetchDiseases = async (): Promise<IDisease[]> => {

  
  //const response = await fetch("http://localhost:9999/api/diseases");
  const response = await fetch("https://emr-backend-intz.onrender.com/api/diseases");
  if (!response.ok) {
    throw new Error("Failed to fetch diseases");
  }
  return response.json();
};

export  const useGetDiseases = () => {
    return useQuery<IDisease[], Error>({
        queryKey: ['diseases'],
        queryFn: fetchDiseases,
        refetchOnWindowFocus: false,
    });
};


  /* export const useGetDiseases = () => {
    return useQuery<IDisease[], Error>("diseases", fetchDiseases);
  };
   */

/* 
  export const useFetchDiseases = () => {
    return useQuery<IDisease[], Error>(["diseases"], fetchDiseases);
  };
 */