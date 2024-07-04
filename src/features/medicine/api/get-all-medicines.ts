import { useQuery } from "@tanstack/react-query";
import { IMedicine } from "../model/IMedicine";


export const fetchMedicines = async () => {
  console.log("fetchMedicines from frontend");
    const response = await fetch("http://localhost:9999/api/medicines");
    if (!response.ok) {
      throw new Error("Failed to fetch medicines");
    }
    return response.json();
  };
  
  
  export const useGetMedicines = () => {
    return useQuery<IMedicine[], Error>({
        queryKey: ['medicines'],
        queryFn: fetchMedicines,
        refetchOnWindowFocus: false,
    });
};