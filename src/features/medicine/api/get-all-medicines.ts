import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { IMedicine } from "../model/IMedicine";

export const fetchMedicines = async () => {
  
  console.log("fetchMedicines from frontend");

  const apiUrl = import.meta.env.VITE_API_URL; 
  //const response = await fetch("https://emr-backend-intz.onrender.com/api/medicines");
  const response = await fetch(apiUrl+"api/medicines");
  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Rate limit exceeded");
    }
    throw new Error("Failed to fetch medicines");
  }
  return response.json();
};

export const useGetMedicines = () => {
  return useQuery<IMedicine[], Error>(
    {
      queryKey: ['medicines'],
      queryFn: fetchMedicines,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error.message === "Rate limit exceeded" && failureCount < 3) {
          return true;
        }
        return false;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    } as UseQueryOptions<IMedicine[], Error> // Cast to UseQueryOptions to ensure type compatibility
  );
};
